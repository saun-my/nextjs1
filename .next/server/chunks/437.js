"use strict";exports.id=437,exports.ids=[437],exports.modules={6818:(e,s,i)=>{i.d(s,{Y9:()=>u,signOut:()=>t});var r=i(6242),a=i(8981);let{auth:l,signIn:o,signOut:t,handlers:u}=(0,r.Ay)({providers:[(0,a.A)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},authorize:async e=>{let s=e?.email,r=e?.password,{default:a}=await i.e(584).then(i.bind(i,6584)),l=a(process.env.POSTGRES_URL,{ssl:"require"===process.env.POSTGRES_SSL?"require":void 0}),o=(await l`
          SELECT
            u.id, u.name, u.email, u.password, u.is_vip,
            COALESCE(STRING_AGG(r.name, ','), '') AS roles
          FROM users u
          LEFT JOIN user_roles ur ON ur.user_id = u.id
          LEFT JOIN roles r ON r.id = ur.role_id
          WHERE u.email = ${s}
          GROUP BY u.id
          LIMIT 1
        `)[0];if(!o)return null;let t=await i.e(814).then(i.bind(i,3814));return await t.compare(r,o.password)?{id:o.id,name:o.name,email:o.email,isVip:o.is_vip,roles:(o.roles??"").split(",").filter(Boolean)}:null}})],secret:process.env.AUTH_SECRET,session:{strategy:"jwt"},callbacks:{jwt:async({token:e,user:s})=>(s&&(e.isVip=s.isVip??!1,e.roles=s.roles??[]),e),session:async({session:e,token:s})=>(e.user={...e.user,id:s.sub,roles:s.roles??[],isVip:s.isVip??!1},e)}})}};