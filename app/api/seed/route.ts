import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../../lib/placeholder-data';
import {
  fetchCourses,
  fetchLessonsByCourseId,
  fetchQuizByLessonId,
} from '../../lib/learn-data';



const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_vip BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_vip BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, is_vip)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${false})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      avatar_url TEXT,
      phone TEXT,
      bio TEXT
    );
  `;

  return insertedUsers;
}

async function seedRoles() {
  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `;
  await Promise.all([
    sql`INSERT INTO roles (name) VALUES ('user') ON CONFLICT (name) DO NOTHING`,
    sql`INSERT INTO roles (name) VALUES ('vip') ON CONFLICT (name) DO NOTHING`,
    sql`INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING`,
  ]);
}

async function seedPermissions() {
  await sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
  `;
  const inserts = [
    ['view_courses', '查看课程'],
    ['access_vip_content', '访问 VIP 内容'],
    ['view_dashboard', '查看后台仪表盘'],
    ['edit_customers', '编辑客户'],
    ['edit_invoices', '编辑账单'],
    ['manage_users', '管理用户与权限'],
  ];
  await Promise.all(
    inserts.map(([name, desc]) =>
      sql`INSERT INTO permissions (name, description) VALUES (${name}, ${desc}) ON CONFLICT (name) DO NOTHING`,
    ),
  );
}

async function seedRolePermissionMappings() {
  await sql`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );
  `;

  const map = async (role: string, perm: string) =>
    sql`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (
        (SELECT id FROM roles WHERE name=${role}),
        (SELECT id FROM permissions WHERE name=${perm})
      )
      ON CONFLICT DO NOTHING
    `;

  await map('user', 'view_courses');
  await map('vip', 'view_courses');
  await map('vip', 'access_vip_content');
  await map('admin', 'view_courses');
  await map('admin', 'access_vip_content');
  await map('admin', 'view_dashboard');
  await map('admin', 'edit_customers');
  await map('admin', 'edit_invoices');
  await map('admin', 'manage_users');
}

async function seedUserRoles() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, role_id)
    );
  `;

  await sql`
    INSERT INTO user_roles (user_id, role_id)
    VALUES (
      ${users[0].id},
      (SELECT id FROM roles WHERE name='user')
    )
    ON CONFLICT DO NOTHING
  `;
}

async function seedInvoices() {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
  await Promise.all(
    invoices.map((invoice) =>
      sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;
  await Promise.all(
    customers.map((customer) =>
      sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;
  await Promise.all(
    revenue.map((rev) =>
      sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );
}

async function seedLearningSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_url TEXT,
      lessons_count INT NOT NULL,
      estimated_hours INT NOT NULL,
      difficulty_score INT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      objective TEXT,
      content TEXT,
      duration_min INT NOT NULL,
      order_index INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      choices JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS user_learning_profiles (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      preferred_difficulty INT,
      preferred_topics TEXT[] DEFAULT '{}',
      learning_style TEXT,
      weekly_goal_hours INT,
      study_time_preference TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS user_course_progress (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      completed_lessons TEXT[] DEFAULT '{}',
      total_score INT DEFAULT 0,
      time_spent_minutes INT DEFAULT 0,
      completion_percentage REAL DEFAULT 0,
      last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_completed BOOLEAN NOT NULL DEFAULT FALSE,
      certificate_earned BOOLEAN NOT NULL DEFAULT FALSE,
      PRIMARY KEY (user_id, course_id)
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      icon_url TEXT,
      earned_date TIMESTAMPTZ NOT NULL,
      category TEXT
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_activities (
      id TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      lesson_id TEXT,
      activity_type TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      score INT,
      time_spent INT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS investments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      fund_code TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      price NUMERIC NOT NULL,
      trade_date DATE NOT NULL,
      note TEXT
    );
  `;
}

async function seedLearningData() {
  const courses = await fetchCourses('');
  for (const c of courses) {
    await sql`
      INSERT INTO courses (id, title, level, description, cover_url, lessons_count, estimated_hours, difficulty_score, tags)
      VALUES (${c.id}, ${c.title}, ${c.level}, ${c.description}, ${c.cover_url}, ${c.lessons_count}, ${c.estimated_hours}, ${c.difficulty_score}, ${sql.array(c.tags)})
      ON CONFLICT (id) DO NOTHING;
    `;
    const lessons = await fetchLessonsByCourseId(c.id);
    for (const l of lessons) {
      await sql`
        INSERT INTO lessons (id, course_id, title, objective, content, duration_min, order_index)
        VALUES (${l.id}, ${l.course_id}, ${l.title}, ${l.objective}, ${l.content}, ${l.duration_min}, ${l.order_index})
        ON CONFLICT (id) DO NOTHING;
      `;
      const quiz = await fetchQuizByLessonId(l.id);
      for (const q of quiz) {
        await sql`
          INSERT INTO quiz_questions (id, lesson_id, prompt, choices)
          VALUES (${q.id}, ${q.lesson_id}, ${q.prompt}, ${sql.json(q.choices)})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
  }

  const defaultUserId = users[0]?.id;
  if (defaultUserId) {
    await sql`
      INSERT INTO user_learning_profiles (user_id, preferred_difficulty, preferred_topics, learning_style, weekly_goal_hours, study_time_preference)
      VALUES (${defaultUserId}, ${5}, ${sql.array(['programming', 'web development'])}, ${'interactive'}, ${10}, ${'flexible'})
      ON CONFLICT (user_id) DO NOTHING;
    `;
    await sql`
      INSERT INTO user_course_progress (user_id, course_id, completed_lessons, total_score, time_spent_minutes, completion_percentage, is_completed, certificate_earned)
      VALUES (${defaultUserId}, ${'course-a1'}, ${sql.array(['lesson-a1-01'])}, ${85}, ${20}, ${12.5}, ${false}, ${false})
      ON CONFLICT (user_id, course_id) DO NOTHING;
    `;
    await sql`
      INSERT INTO achievements (id, user_id, title, description, icon_url, earned_date, category)
      VALUES (${`init-achievement-${Date.now()}`}, ${defaultUserId}, ${'首次学习'}, ${'完成第一个课时'}, ${'/achievements/first-lesson.png'}, ${new Date()}, ${'completion'})
      ON CONFLICT (id) DO NOTHING;
    `;

    await sql`
      INSERT INTO investments (user_id, fund_code, amount, price, trade_date, note)
      VALUES (${defaultUserId}, ${'110022'}, ${1000}, ${1.25}, ${new Date()}, ${'首次买入示例'})
      ON CONFLICT DO NOTHING;
    `;
  }
}

export async function GET() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
    await seedUsers();
    await seedRoles();
    await seedPermissions();
    await seedRolePermissionMappings();
    await seedUserRoles();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    await seedLearningSchema();
    await seedLearningData();
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
