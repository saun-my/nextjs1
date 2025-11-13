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
"[project]/nextjs1/app/api/funds/list/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
function toList(data) {
    return (data || []).map((it)=>({
            code: it.code,
            name: it.name,
            net: it.netWorth || it.net || null,
            dayGrowth: it.dayGrowth || it.expectGrowth || 0,
            lastUpdate: it.lastUpdate || it.netWorthDate || null,
            type: it.type || ''
        }));
}
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
async function fetchEastmoneyRank(pn) {
    const ts = Date.now();
    const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=${ts}`;
    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('fetch failed');
    const text = await res.text();
    const m = text.match(/\/\*\*(.*?)\*\*\/|\((\{[\s\S]*?\})\)/);
    const payload = m?.[1] || m?.[2] || '';
    const jsonMatch = payload.match(/\{[\s\S]*\}/);
    const raw = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    const rows = raw?.datas || [];
    const list = rows.map((row)=>{
        const parts = row.split(',');
        return {
            code: parts[0],
            name: parts[1],
            net: null,
            dayGrowth: Number(parts[7] || 0),
            lastUpdate: null,
            type: parts[3] || ''
        };
    });
    return list;
}
async function fetchEastmoneyMobile(pageSize) {
    const url = `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?appType=ttjj&product=EFund&plat=Iphone&SRC=kf&Sort=desc&FundTypeCode=&PageIndex=1&PageSize=${pageSize}`;
    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    const rows = json?.Datas || [];
    return rows.map((it)=>({
            code: it.FCODE,
            name: it.SHORTNAME,
            net: it.NAV ? Number(it.NAV) : null,
            dayGrowth: it.GSZZL ? Number(it.GSZZL) : 0,
            lastUpdate: it.NAVDATE || null,
            type: it.FTNAME || ''
        }));
}
async function fetchPingzhongItem(code) {
    const url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('fetch failed');
    const js = await res.text();
    const nameMatch = js.match(/var\s+fS_name\s*=\s*"([^"]+)"/);
    const typeMatch = js.match(/var\s+fS_type\s*=\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : code;
    const type = typeMatch ? typeMatch[1] : '';
    const trendMatch = js.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
    let net = null;
    let lastUpdate = null;
    let dayGrowth = 0;
    if (trendMatch) {
        try {
            const arr = JSON.parse(trendMatch[1]);
            if (Array.isArray(arr) && arr.length > 0) {
                const l = arr.length - 1;
                const latest = arr[l];
                net = typeof latest?.y === 'number' ? latest.y : null;
                lastUpdate = latest?.x ? new Date(latest.x).toISOString().slice(0, 10) : null;
                if (l > 0 && typeof arr[l - 1]?.y === 'number' && arr[l - 1].y > 0 && net != null) {
                    dayGrowth = Number(((net - arr[l - 1].y) / arr[l - 1].y * 100).toFixed(2));
                }
            }
        } catch  {}
    }
    return {
        code,
        name,
        net,
        dayGrowth,
        lastUpdate,
        type
    };
}
async function fetchPingzhongList(codes) {
    const results = await Promise.all(codes.map(async (c)=>{
        try {
            return await fetchPingzhongItem(c);
        } catch  {
            return {
                code: c,
                name: c,
                net: null,
                dayGrowth: 0,
                lastUpdate: null,
                type: ''
            };
        }
    }));
    return results;
}
async function GET(req) {
    try {
        const listUrl = process.env.FUND_API_LIST_URL || 'https://api.doctorxiong.club/v1/fund/rank';
        try {
            const data = await fetchWithTimeout(listUrl, 4000);
            const list = toList(data?.data || data?.list || []);
            if (list.length > 0) return Response.json({
                list,
                count: list.length,
                source: listUrl
            });
        } catch  {}
        try {
            const list = await fetchEastmoneyMobile(50);
            if (list.length > 0) return Response.json({
                list,
                count: list.length,
                source: 'eastmoney'
            });
        } catch  {}
        const defaultCodes = (process.env.FUND_TOP_CODES || '110022,161725,519732,001632,003095').split(',').map((s)=>s.trim()).filter(Boolean);
        try {
            const list = await fetchPingzhongList(defaultCodes);
            return Response.json({
                list,
                count: list.length,
                source: 'pingzhongdata'
            });
        } catch  {}
        const fallback = defaultCodes.map((c)=>({
                code: c,
                name: c,
                net: null,
                dayGrowth: 0,
                lastUpdate: null,
                type: ''
            }));
        return Response.json({
            list: fallback,
            count: fallback.length,
            source: 'fallback'
        });
    } catch (e) {
        const defaultCodes = (process.env.FUND_TOP_CODES || '110022,161725,519732,001632,003095').split(',').map((s)=>s.trim()).filter(Boolean);
        const fallback = defaultCodes.map((c)=>({
                code: c,
                name: c,
                net: null,
                dayGrowth: 0,
                lastUpdate: null,
                type: ''
            }));
        return Response.json({
            list: fallback,
            count: fallback.length,
            source: 'fallback'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3c31b1b8._.js.map