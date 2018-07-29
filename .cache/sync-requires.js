// prefer default export if available
const preferDefault = m => m && m.default || m


exports.layouts = {

}

exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/fredericgessler/Documents/tick/.cache/dev-404-page.js")),
  "component---src-pages-index-js": preferDefault(require("/Users/fredericgessler/Documents/tick/src/pages/index.js"))
}

exports.json = {
  "dev-404-page.json": require("/Users/fredericgessler/Documents/tick/.cache/json/dev-404-page.json"),
  "index.json": require("/Users/fredericgessler/Documents/tick/.cache/json/index.json")
}