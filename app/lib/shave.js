// TODO: think about memory characteristics
// Polymer's internal mustache parser is not so usable to parse arbitry user
// strings, here is a lightweight alternative
// interpolates mustaches. shaves out the mustache.
var OPEN = '{{', CLOSE = '}}'

function shave(str) {
  if (!str || !str.length)
    return;

  // [start index, end index, token value], ...
  var tokens = []
  var index = 0
  var start, end, token
  while (0 <= index && index < str.length) {
    if (start) {
      end = index = str.indexOf(CLOSE, index)
      if (end == -1) {
        break;
      }
      token = str.slice(start+OPEN.length, end)
      tokens.push([start, end+CLOSE.length, token])
      start = end = token = null
    }
    else {
      start = index = str.indexOf(OPEN, index)
    }
  }
  // obj is the context
  function interpolate(obj) {
    for (var i = tokens.length - 1; i >= 0; i--) {
      str = str.slice(0, tokens[i][0])   // cut start to token start
          + (obj[tokens[i][2]] || '')     // insert value
          + str.slice(tokens[i][1], str.length)   // cut start to token end
    }
    return str
  }

  if (tokens.length === 0) {
    return str
  }
  else {
    return interpolate;
  }
}

export default shave