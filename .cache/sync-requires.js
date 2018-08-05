// prefer default export if available
const preferDefault = m => m && m.default || m


exports.layouts = {

}

exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/fredericgessler/Documents/frontend/ticc/.cache/dev-404-page.js")),
  "component---src-pages-index-js": preferDefault(require("/Users/fredericgessler/Documents/frontend/ticc/src/pages/index.js"))
}

exports.json = {
  "dev-404-page.json": require("/Users/fredericgessler/Documents/frontend/ticc/.cache/json/dev-404-page.json"),
  "index.json": require("/Users/fredericgessler/Documents/frontend/ticc/.cache/json/index.json")
}