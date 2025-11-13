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
"[project]/nextjs1/app/api/funds/[code]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
async function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const id = setTimeout(()=>controller.abort(), ms);
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            signal: controller.signal
        });
        if (!res.ok) throw new Error('fetch failed');
        return await res.json();
    } finally{
        clearTimeout(id);
    }
}
async function fetchEastmoneyDetail(code) {
    const url = `http://fund.eastmoney.com/${code}.html`;
    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('fetch failed');
    const html = await res.text();
    const nameMatch = html.match(/<h1.*?>(.*?)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : '基金';
    const typeMatch = html.match(/基金类型：<a[^>]*>(.*?)<\/a>/);
    const type = typeMatch ? typeMatch[1].trim() : '';
    const netMatch = html.match(/单位净值.*?<span.*?>([\d\.]+)<\/span>/);
    const netWorth = netMatch ? Number(netMatch[1]) : null;
    const dateMatch = html.match(/净值日期：<span.*?>([\d\-]+)<\/span>/);
    const netWorthDate = dateMatch ? dateMatch[1] : null;
    const dayMatch = html.match(/日增长率.*?<span.*?>([-+\d\.]+)%<\/span>/);
    const dayGrowth = dayMatch ? Number(dayMatch[1]) : 0;
    return {
        data: [
            {
                code,
                name,
                type,
                netWorth,
                netWorthDate,
                dayGrowth,
                lastMonthGrowth: 0,
                lastThreeMonthsGrowth: 0,
                lastYearGrowth: 0,
                company: ''
            }
        ]
    };
}
async function fetchPingzhongData(code) {
    const url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('fetch failed');
    const js = await res.text();
    const nameMatch = js.match(/var\s+fS_name\s*=\s*"([^"]+)"/);
    const typeMatch = js.match(/var\s+fS_type\s*=\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : '基金';
    const type = typeMatch ? typeMatch[1] : '';
    const trendMatch = js.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
    let netWorth = null;
    let netWorthDate = null;
    let dayGrowth = 0;
    let lastMonthGrowth = 0;
    let lastThreeMonthsGrowth = 0;
    let lastYearGrowth = 0;
    if (trendMatch) {
        try {
            const arr = JSON.parse(trendMatch[1]);
            if (Array.isArray(arr) && arr.length > 0) {
                const l = arr.length - 1;
                const latest = arr[l];
                netWorth = typeof latest?.y === 'number' ? latest.y : null;
                netWorthDate = latest?.x ? new Date(latest.x).toISOString().slice(0, 10) : null;
                if (l > 0 && typeof arr[l - 1]?.y === 'number' && arr[l - 1].y > 0 && netWorth != null) {
                    dayGrowth = Number(((netWorth - arr[l - 1].y) / arr[l - 1].y * 100).toFixed(2));
                }
                const idx1m = Math.max(0, l - 22);
                const idx3m = Math.max(0, l - 66);
                const idx1y = Math.max(0, l - 252);
                if (typeof arr[idx1m]?.y === 'number' && arr[idx1m].y > 0 && netWorth != null) {
                    lastMonthGrowth = Number(((netWorth - arr[idx1m].y) / arr[idx1m].y * 100).toFixed(2));
                }
                if (typeof arr[idx3m]?.y === 'number' && arr[idx3m].y > 0 && netWorth != null) {
                    lastThreeMonthsGrowth = Number(((netWorth - arr[idx3m].y) / arr[idx3m].y * 100).toFixed(2));
                }
                if (typeof arr[idx1y]?.y === 'number' && arr[idx1y].y > 0 && netWorth != null) {
                    lastYearGrowth = Number(((netWorth - arr[idx1y].y) / arr[idx1y].y * 100).toFixed(2));
                }
            }
        } catch  {}
    }
    return {
        data: [
            {
                code,
                name,
                type,
                netWorth,
                netWorthDate,
                dayGrowth,
                lastMonthGrowth,
                lastThreeMonthsGrowth,
                lastYearGrowth,
                company: ''
            }
        ]
    };
}
async function GET(req, { params }) {
    try {
        const { code } = await params;
        const base = process.env.FUND_API_DETAIL_URL || 'https://api.doctorxiong.club/v1/fund?code=';
        try {
            const data = await fetchWithTimeout(`${base}${encodeURIComponent(code)}`, 4000);
            return Response.json(data);
        } catch  {}
        try {
            const data = await fetchPingzhongData(code);
            return Response.json(data);
        } catch  {}
        const data = await fetchEastmoneyDetail(code);
        return Response.json(data);
    } catch (e) {
        const fallback = {
            data: [
                {
                    code: await (await params).code,
                    name: '示例基金',
                    type: '指数',
                    netWorth: null,
                    netWorthDate: null,
                    dayGrowth: 0,
                    lastMonthGrowth: 0,
                    lastThreeMonthsGrowth: 0,
                    lastYearGrowth: 0,
                    company: '示例公司'
                }
            ]
        };
        return Response.json(fallback);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ca819454._.js.map