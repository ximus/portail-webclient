Array.wrap = function(obj) {
  if (obj instanceof Array) {
    return obj
  }
  if (typeof obj === 'undefined') {
    return []
  }
  return [obj]
}