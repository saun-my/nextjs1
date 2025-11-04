(()=>{var e={};e.id=530,e.ids=[530],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1645:e=>{"use strict";e.exports=require("net")},1820:e=>{"use strict";e.exports=require("os")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3568:()=>{},3840:()=>{},4631:e=>{"use strict";e.exports=require("tls")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4998:e=>{"use strict";e.exports=require("perf_hooks")},5511:e=>{"use strict";e.exports=require("crypto")},7910:e=>{"use strict";e.exports=require("stream")},9021:e=>{"use strict";e.exports=require("fs")},9268:(e,t,a)=>{"use strict";e.exports=a(4870)},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9600:(e,t,a)=>{"use strict";a.r(t),a.d(t,{patchFetch:()=>g,routeModule:()=>I,serverHooks:()=>U,workAsyncStorage:()=>L,workUnitAsyncStorage:()=>R});var r={};a.r(r),a.d(r,{GET:()=>v});var s=a(9268),i=a(4825),n=a(5472);let u=require("bcrypt");var o=a.n(u),d=a(6584);let m=[{id:"410544b2-4001-4271-9855-fec4b6a6442a",name:"User",email:"user@nextmail.com",password:"123456"}],c=[{id:"d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",name:"Evil Rabbit",email:"evil@rabbit.com",image_url:"/customers/evil-rabbit.png"},{id:"3958dc9e-712f-4377-85e9-fec4b6a6442a",name:"Delba de Oliveira",email:"delba@oliveira.com",image_url:"/customers/delba-de-oliveira.png"},{id:"3958dc9e-742f-4377-85e9-fec4b6a6442a",name:"Lee Robinson",email:"lee@robinson.com",image_url:"/customers/lee-robinson.png"},{id:"76d65c26-f784-44a2-ac19-586678f7c2f2",name:"Michael Novotny",email:"michael@novotny.com",image_url:"/customers/michael-novotny.png"},{id:"CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",name:"Amy Burns",email:"amy@burns.com",image_url:"/customers/amy-burns.png"},{id:"13D07535-C59E-4157-A011-F8D2EF4E0CBB",name:"Balazs Orban",email:"balazs@orban.com",image_url:"/customers/balazs-orban.png"}],p=[{customer_id:c[0].id,amount:15795,status:"pending",date:"2022-12-06"},{customer_id:c[1].id,amount:20348,status:"pending",date:"2022-11-14"},{customer_id:c[4].id,amount:3040,status:"paid",date:"2022-10-29"},{customer_id:c[3].id,amount:44800,status:"paid",date:"2023-09-10"},{customer_id:c[5].id,amount:34577,status:"pending",date:"2023-08-05"},{customer_id:c[2].id,amount:54246,status:"pending",date:"2023-07-16"},{customer_id:c[0].id,amount:666,status:"pending",date:"2023-06-27"},{customer_id:c[3].id,amount:32545,status:"paid",date:"2023-06-09"},{customer_id:c[4].id,amount:1250,status:"paid",date:"2023-06-17"},{customer_id:c[5].id,amount:8546,status:"paid",date:"2023-06-07"},{customer_id:c[1].id,amount:500,status:"paid",date:"2023-08-19"},{customer_id:c[5].id,amount:8945,status:"paid",date:"2023-06-03"},{customer_id:c[2].id,amount:1e3,status:"paid",date:"2022-06-05"}],l=[{month:"Jan",revenue:2e3},{month:"Feb",revenue:1800},{month:"Mar",revenue:2200},{month:"Apr",revenue:2500},{month:"May",revenue:2300},{month:"Jun",revenue:3200},{month:"Jul",revenue:3500},{month:"Aug",revenue:3700},{month:"Sep",revenue:2500},{month:"Oct",revenue:2800},{month:"Nov",revenue:3e3},{month:"Dec",revenue:4800}],T=(0,d.A)(process.env.POSTGRES_URL,{ssl:"require"});async function N(){return await T`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,await T`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `,await Promise.all(m.map(async e=>{let t=await o().hash(e.password,10);return T`
        INSERT INTO users (id, name, email, password)
        VALUES (${e.id}, ${e.name}, ${e.email}, ${t})
        ON CONFLICT (id) DO NOTHING;
      `}))}async function E(){return await T`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,await T`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `,await Promise.all(p.map(e=>T`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${e.customer_id}, ${e.amount}, ${e.status}, ${e.date})
        ON CONFLICT (id) DO NOTHING;
      `))}async function O(){return await T`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,await T`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `,await Promise.all(c.map(e=>T`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${e.id}, ${e.name}, ${e.email}, ${e.image_url})
        ON CONFLICT (id) DO NOTHING;
      `))}async function A(){return await T`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `,await Promise.all(l.map(e=>T`
        INSERT INTO revenue (month, revenue)
        VALUES (${e.month}, ${e.revenue})
        ON CONFLICT (month) DO NOTHING;
      `))}async function v(){try{return await T.begin(e=>[N(),O(),E(),A()]),Response.json({message:"Database seeded successfully"})}catch(e){return Response.json({error:e},{status:500})}}let I=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/seed/route",pathname:"/seed",filename:"route",bundlePath:"app/seed/route"},resolvedPagePath:"D:\\桌面\\nextjs1\\app\\seed\\route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:L,workUnitAsyncStorage:R,serverHooks:U}=I;function g(){return(0,n.patchFetch)({workAsyncStorage:L,workUnitAsyncStorage:R})}}};var t=require("../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[472,584],()=>a(9600));module.exports=r})();