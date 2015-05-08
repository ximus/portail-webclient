export default function profileSeedCache(iid, val) {
  if (!iid) return
  var localStorage = window.localStorage
  var key = "user-seed-cache:"+iid
  if (arguments.length === 1) {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return val && localStorage.setItem(key, JSON.stringify(val))
  }
}
