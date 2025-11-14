import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const rows = userId
    ? await sql`SELECT id, user_id, fund_code, amount, price, trade_date, note, action FROM investments WHERE user_id=${userId} ORDER BY trade_date DESC`
    : await sql`SELECT id, user_id, fund_code, amount, price, trade_date, note, action FROM investments ORDER BY trade_date DESC`;
  const header = 'id,user_id,fund_code,amount,price,trade_date,note,action\n';
  const lines = (rows as any[]).map(r => {
    const t = typeof r.trade_date === 'string' ? r.trade_date.slice(0,10) : r.trade_date instanceof Date ? r.trade_date.toISOString().slice(0,10) : String(r.trade_date);
    const n = (r.note ?? '').toString().replace(/"/g, '""');
    return `${r.id},${r.user_id},${r.fund_code},${r.amount},${r.price},${t},"${n}",${r.action}`;
  }).join('\n');
  const csv = header + lines;
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="investments.csv"' } });
}
