module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[project]/nextjs1/app/api/investments/plans/run/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/.pnpm/postgres@3.4.7/node_modules/postgres/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL, {
    ssl: 'require',
    prepare: false
});
async function ensureSchema() {
    await sql`
    CREATE TABLE IF NOT EXISTS investment_plans (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      fund_code TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      frequency TEXT NOT NULL,
      day_of_week INT,
      day_of_month INT,
      start_date DATE NOT NULL,
      end_date DATE,
      next_run DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS investments (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      fund_code TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      price NUMERIC NOT NULL,
      trade_date DATE NOT NULL,
      note TEXT
    );
  `;
}
function fmtDate(d) {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}
function addDays(d, days) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));
}
function nextMonthly(from, dom) {
    const y = from.getUTCFullYear();
    const m = from.getUTCMonth();
    if (from.getUTCDate() <= dom) return new Date(Date.UTC(y, m, dom));
    return new Date(Date.UTC(y, m + 1, dom));
}
async function GET() {
    await ensureSchema();
    const todayISO = fmtDate(new Date());
    const plans = await sql`
    SELECT * FROM investment_plans
    WHERE status='active' AND next_run <= ${todayISO}
      AND (end_date IS NULL OR next_run <= end_date)
  `;
    const origin = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
    const results = [];
    for (const p of plans){
        try {
            let price = null;
            try {
                const res = await fetch(`${origin}/api/funds/${encodeURIComponent(p.fund_code)}`, {
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    price = data?.data?.[0]?.netWorth ?? null;
                }
            } catch  {}
            if (price == null) {
                results.push({
                    id: p.id,
                    skipped: true,
                    reason: 'no price'
                });
                continue;
            }
            await sql`
        INSERT INTO investments (id, user_id, fund_code, amount, price, trade_date, note)
        VALUES (${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}, ${p.user_id}, ${p.fund_code}, ${Number(p.amount)}, ${Number(price)}, ${new Date()}, ${'定投自动执行'})
      `;
            let nextRun;
            if (p.frequency === 'weekly') {
                nextRun = addDays(new Date(p.next_run), 7);
            } else {
                const dom = p.day_of_month ?? new Date(p.next_run).getUTCDate();
                nextRun = nextMonthly(new Date(p.next_run), dom);
            }
            await sql`UPDATE investment_plans SET next_run=${fmtDate(nextRun)} WHERE id=${p.id}`;
            results.push({
                id: p.id,
                executed: true,
                price
            });
        } catch (e) {
            results.push({
                id: p.id,
                error: e.message
            });
        }
    }
    return Response.json({
        ok: true,
        results
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__91321626._.js.map