import _ from '../util'


Object.defineProperty(Object.prototype, 'observeProperty', {
    enumerable: false,
    value: function(prop, func) {
      _.observe(this, prop, func)
    }
})