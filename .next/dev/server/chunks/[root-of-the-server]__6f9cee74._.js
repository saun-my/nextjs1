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
"[project]/nextjs1/app/api/investments/plans/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
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
      frequency TEXT NOT NULL, -- 'weekly' | 'monthly'
      day_of_week INT, -- 0-6, for weekly
      day_of_month INT, -- 1-31, for monthly
      start_date DATE NOT NULL,
      end_date DATE,
      next_run DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'paused'
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}
function fmtDate(d) {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}
function nextWeekly(from, dow) {
    const curDow = from.getUTCDay();
    const diff = (dow - curDow + 7) % 7;
    const next = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + diff));
    return next;
}
function nextMonthly(from, dom) {
    const y = from.getUTCFullYear();
    const m = from.getUTCMonth();
    const cur = new Date(Date.UTC(y, m, Math.min(dom, 28))); // avoid overflow for simplicity
    if (from.getUTCDate() <= dom) return new Date(Date.UTC(y, m, dom));
    const next = new Date(Date.UTC(y, m + 1, dom));
    return next;
}
async function GET(req) {
    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const rows = userId ? await sql`SELECT * FROM investment_plans WHERE user_id = ${userId} ORDER BY created_at DESC` : await sql`SELECT * FROM investment_plans ORDER BY created_at DESC LIMIT 100`;
    return Response.json(rows);
}
async function POST(req) {
    await ensureSchema();
    const body = await req.json();
    const { user_id, fund_code, amount, frequency, day_of_week, day_of_month, start_date, end_date } = body;
    if (!user_id || !fund_code || !amount || !frequency || !start_date) {
        return Response.json({
            error: 'missing fields'
        }, {
            status: 400
        });
    }
    const start = new Date(start_date);
    let next;
    if (frequency === 'weekly') {
        const dow = typeof day_of_week === 'number' ? day_of_week : start.getUTCDay();
        next = nextWeekly(start, dow);
    } else if (frequency === 'monthly') {
        const dom = typeof day_of_month === 'number' ? day_of_month : start.getUTCDate();
        next = nextMonthly(start, dom);
    } else {
        return Response.json({
            error: 'invalid frequency'
        }, {
            status: 400
        });
    }
    await sql`
    INSERT INTO investment_plans (id, user_id, fund_code, amount, frequency, day_of_week, day_of_month, start_date, end_date, next_run, status)
    VALUES (${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}, ${user_id}, ${fund_code}, ${Number(amount)}, ${frequency}, ${day_of_week ?? null}, ${day_of_month ?? null}, ${start}, ${end_date ? new Date(end_date) : null}, ${fmtDate(next)}, ${'active'})
  `;
    return Response.json({
        ok: true
    });
}
async function PATCH(req) {
    await ensureSchema();
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return Response.json({
        error: 'missing fields'
    }, {
        status: 400
    });
    await sql`UPDATE investment_plans SET status=${status} WHERE id=${id}`;
    return Response.json({
        ok: true
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6f9cee74._.js.map