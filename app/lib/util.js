var _ = {
  isPlainObject: function(value) {
    return typeof value == 'object' && value.constructor == Object
  },

  isString: function(value) {
    return typeof value === 'string'
  },

  // https://github.com/lodash/lodash
  // memoize: function (func, resolver) {
  //   if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
  //     throw new TypeError(FUNC_ERROR_TEXT);
  //   }
  //   var memoized = function() {
  //     var cache = memoized.cache,
  //         key = resolver ? resolver.apply(this, arguments) : arguments[0];

  //     if (cache.has(key)) {
  //       return cache.get(key);
  //     }
  //     var result = func.apply(this, arguments);
  //     cache.set(key, result);
  //     return result;
  //   };
  //   memoized.cache = new memoize.Cache;
  //   return memoized;
  // }
  observe: function(obj, prop, cb) {
    var observer = new ObjectObserver(obj);
    observer.open(function(added, removed, changed, getOldValueFn) {
      // respond to changes to the obj.
      function check(property) {
        // console.log("P ", obj, property, obj[property])
        if (property == prop) {
          cb.call(obj, getOldValueFn(prop), obj[prop])
        }
      }
      Object.keys(added).forEach(check);
      Object.keys(removed).forEach(check);
      Object.keys(changed).forEach(check);
    });

    // Object.observe(obj, function(changes) {
    //   changes.forEach(function(change) {
    //     if (change.name == prop) {
    //       // console.log("[Object Change]", obj, prop, change)
    //       func.call(obj, change.oldValue, obj[prop])
    //     }
    //   })
    // })
  },

  capitalize: function(string) {
    if (!string) return ''
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export default _