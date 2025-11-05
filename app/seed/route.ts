import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

export const runtime = 'nodejs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

  // 人员信息表（可选）
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

// 角色与权限相关
async function seedRoles() {
  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

  // 简化：通过子查询按名称映射
  const map = async (role: string, perm: string) =>
    sql`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (
        (SELECT id FROM roles WHERE name=${role}),
        (SELECT id FROM permissions WHERE name=${perm})
      )
      ON CONFLICT DO NOTHING
    `;

  // user
  await map('user', 'view_courses');

  // vip
  await map('vip', 'view_courses');
  await map('vip', 'access_vip_content');

  // admin
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

  // 默认将占位用户分配为普通 user 角色
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
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedRoles(),
      seedPermissions(),
      seedRolePermissionMappings(),
      seedUserRoles(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}