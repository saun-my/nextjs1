module.exports=[1862,66307,19039,53527,a=>{"use strict";var b=a.i(58205);let c=b.forwardRef(function({title:a,titleId:c,...d},e){return b.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:e,"aria-labelledby":c},d),a?b.createElement("title",{id:c},a):null,b.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}))});a.s(["ClockIcon",0,c],1862);var d=a.i(34310);function e(){for(var a,b,c=0,d="",e=arguments.length;c<e;c++)(a=arguments[c])&&(b=function a(b){var c,d,e="";if("string"==typeof b||"number"==typeof b)e+=b;else if("object"==typeof b)if(Array.isArray(b)){var f=b.length;for(c=0;c<f;c++)b[c]&&(d=a(b[c]))&&(e&&(e+=" "),e+=d)}else for(d in b)b[d]&&(e&&(e+=" "),e+=d);return e}(a))&&(d&&(d+=" "),d+=b);return d}a.s(["clsx",()=>e,"default",0,e],66307);let f=(a,b,c,d)=>{a.forEach(a=>{if("string"==typeof a){(""===a?b:g(b,a)).classGroupId=c;return}"function"==typeof a?h(a)?f(a(d),b,c,d):b.validators.push({validator:a,classGroupId:c}):Object.entries(a).forEach(([a,e])=>{f(e,g(b,a),c,d)})})},g=(a,b)=>{let c=a;return b.split("-").forEach(a=>{c.nextPart.has(a)||c.nextPart.set(a,{nextPart:new Map,validators:[]}),c=c.nextPart.get(a)}),c},h=a=>a.isThemeGetter,i=a=>{let b;if("string"==typeof a)return a;let c="";for(let d=0;d<a.length;d++)a[d]&&(b=i(a[d]))&&(c&&(c+=" "),c+=b);return c},j=new Set(["px","full","screen"]),k=new Set(["length","size","percentage"]),l=new Set(["image","url"]);function m(a,b="USD",c="en-US"){return new Intl.NumberFormat(c,{style:"currency",currency:b}).format(a/100)}function n(a){let b=Array.isArray(a)&&a.length>0?Math.max(...a.map(a=>a.revenue)):0,c=b>0?1e3*Math.ceil(b/1e3):0,d=[];for(let a=4;a>=0;a--){let b=c>0?Math.round(c/4*a):0;d.push(b.toLocaleString())}return{yAxisLabels:d,topLabel:c}}function o(a,b="en-US"){let c=new Date(a);return new Intl.DateTimeFormat(b,{year:"numeric",month:"short",day:"numeric"}).format(c)}a.s(["formatCurrency",()=>m,"formatDateToLocal",()=>o,"generateYAxis",()=>n],19039);let p=(0,d.default)(process.env.POSTGRES_URL,{ssl:"require"});async function q(){try{return await p`SELECT * FROM revenue`}catch(a){throw console.error("Database Error:",a),Error("Failed to fetch revenue data.")}}async function r(){try{return(await p`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`).map(a=>({...a,amount:m(a.amount)}))}catch(a){throw console.error("Database Error:",a),Error("Failed to fetch the latest invoices.")}}async function s(){try{let a=p`SELECT COUNT(*) FROM invoices`,b=p`SELECT COUNT(*) FROM customers`,c=p`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`,d=await Promise.all([a,b,c]),e=Number(d[0][0].count??"0"),f=Number(d[1][0].count??"0"),g=m(d[2][0].paid??"0"),h=m(d[2][0].pending??"0");return{numberOfCustomers:f,numberOfInvoices:e,totalPaidInvoices:g,totalPendingInvoices:h}}catch(a){throw console.error("Database Error:",a),Error("Failed to fetch card data.")}}async function t(a,b){try{return await p`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${a}%`} OR
        customers.email ILIKE ${`%${a}%`} OR
        invoices.amount::text ILIKE ${`%${a}%`} OR
        invoices.date::text ILIKE ${`%${a}%`} OR
        invoices.status ILIKE ${`%${a}%`}
      ORDER BY invoices.date DESC
      LIMIT ${6} OFFSET ${(b-1)*6}
    `}catch(a){throw console.error("Database Error:",a),Error("Failed to fetch invoices.")}}a.s(["fetchCardData",()=>s,"fetchFilteredInvoices",()=>t,"fetchLatestInvoices",()=>r,"fetchRevenue",()=>q],53527)}];

//# sourceMappingURL=11948_%40heroicons_react_24_outline_esm_ClockIcon_2e115fdf.js.map