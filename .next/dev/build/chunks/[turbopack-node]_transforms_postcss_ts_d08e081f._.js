module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/nextjs1/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/bff8f__pnpm_8fb5caf7._.js",
  "chunks/[root-of-the-server]__0407ad7c._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/nextjs1/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];