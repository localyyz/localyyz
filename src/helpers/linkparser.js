import qs from "qs"
import url from "url"

function hasRel(x) {
  return x && x.rel
}

function intoRels(acc, x) {
  function splitRel(rel) {
    acc[rel] = Object.assign(x, { rel: rel })
  }

  x.rel.split(/\s+/).forEach(splitRel)

  return acc
}

function createObjects(acc, p) {
  // rel="next" => 1: rel 2: next
  var m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/)
  if (m) acc[m[1]] = m[2]
  return acc
}

function parseLink(link) {
  try {
    var m = link.match(/<?([^>]*)>(.*)/),
      linkUrl = m[1],
      parts = m[2].split(";"),
      parsedUrl = url.parse(linkUrl),
      qry = qs.parse(parsedUrl.query)

    // remove prefix `; `
    parts.shift()

    var info = parts.reduce(createObjects, {})

    info = Object.assign(qry, info)
    info.url = linkUrl
    return info
  } catch (e) {
    return null
  }
}

const linkParser = linkHeader => {
  if (!linkHeader) return null

  return linkHeader
    .split(/,\s*</)
    .map(parseLink)
    .filter(hasRel)
    .reduce(intoRels, {})
}
export default linkParser