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
  },

  dom: {
    /**
     * Get closest DOM element up the tree that contains a class, ID, or data attribute
     * @param  {Node} elem The base element
     * @param  {String} selector The class, id, data attribute, or tag to look for
     * @return {Node} Null if no match
     * http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
     */
    getClosest: function (elem, selector) {

        var firstChar = selector.charAt(0);

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {

            // If selector is a class
            if ( firstChar === '.' ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    return elem;
                }
            }

            // If selector is an ID
            if ( firstChar === '#' ) {
                if ( elem.id === selector.substr(1) ) {
                    return elem;
                }
            }

            // If selector is a data attribute
            if ( firstChar === '[' ) {
                if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                    return elem;
                }
            }

            // If selector is a tag
            if ( elem.tagName.toLowerCase() === selector ) {
                return elem;
            }

        }

        return false;
    }
  }
}

export default _