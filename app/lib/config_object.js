import shave from "./shave"
import _ from './util'

function ConfigObject(obj) {
  this.obj = obj
  for (var prop in obj) {
    if (!obj.hasOwnProperty(prop)) continue
    Object.defineProperty(this, prop, {
      enumerable: true,
      // with caching
      get: (function(prop) { return function() {
        var ret = this["_"+prop]
        var orig = this.obj[prop]

        if (typeof ret !== 'undefined') {
          return ret
        }
        else if (typeof orig === 'undefined'){
          return undefined
        }

        if (_.isPlainObject(orig)) {
          ret = new ConfigObject(orig)
        }
        else if (_.isString(orig)) {
          // this returns the orig if no tokens are found
          ret = ConfigObject.tpl(orig)
        }
        else {
          ret = orig
        }
        this["_"+prop] = ret

        return ret
      }})(prop)
    })
  }
}

ConfigObject.prototype = {
  toString: function() {
    return JSON.stringify(this.obj)
  }
}

ConfigObject.tpl = shave

export default ConfigObject