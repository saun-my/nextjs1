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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[project]/nextjs1/app/api/investments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/.pnpm/postgres@3.4.7/node_modules/postgres/src/index.js [app-route] (ecmascript)");
;
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING, {
    ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined
});
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const rows = userId ? await sql`SELECT * FROM investments WHERE user_id = ${userId} ORDER BY trade_date DESC, id DESC` : await sql`SELECT * FROM investments ORDER BY trade_date DESC, id DESC LIMIT 100`;
        return Response.json(rows);
    } catch (e) {
        return Response.json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const { user_id, fund_code, amount, price, trade_date, note, action } = body;
        if (!user_id || !fund_code || !amount || !price || !trade_date) {
            return Response.json({
                error: 'missing fields'
            }, {
                status: 400
            });
        }
        await sql`
      INSERT INTO investments (id, user_id, fund_code, amount, price, trade_date, note, action)
      VALUES (${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}, ${user_id}, ${fund_code}, ${Number(amount)}, ${Number(price)}, ${new Date(trade_date)}, ${note ?? null}, ${action ?? 'buy'})
    `;
        return Response.json({
            ok: true
        });
    } catch (e) {
        return Response.json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, amount, price, trade_date, note, action } = body;
        if (!id) return Response.json({
            error: 'missing id'
        }, {
            status: 400
        });
        await sql`
      UPDATE investments
      SET amount = COALESCE(${amount != null ? Number(amount) : null}, amount),
          price = COALESCE(${price != null ? Number(price) : null}, price),
          trade_date = COALESCE(${trade_date ? new Date(trade_date) : null}, trade_date),
          note = COALESCE(${note ?? null}, note),
          action = COALESCE(${action ?? null}, action)
      WHERE id = ${id}
    `;
        return Response.json({
            ok: true
        });
    } catch (e) {
        return Response.json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return Response.json({
            error: 'missing id'
        }, {
            status: 400
        });
        await sql`DELETE FROM investments WHERE id=${id}`;
        return Response.json({
            ok: true
        });
    } catch (e) {
        return Response.json({
            error: e.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__24aaf3e9._.js.map