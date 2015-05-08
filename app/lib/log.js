function debug() {
  if (window.dev) {
    // console.log(this.decorateArgs(arguments))
    // console.log(arguments, this.decorateArgs(arguments), this.namespace)
    console.log.apply(console, this.decorateArgs(arguments))
  }
}

function error() {
  // it would be nice to report errors back to server
  if (window.dev) {
    console.error.apply(console, this.decorateArgs(arguments))
  }
}

function Logger() {
  var self = this
  var ret = function() {
    ret.debug.apply(ret, arguments)
  }
  ret.__proto__ = this
  return ret
}

Logger.prototype = {
  debug: debug,
  error: error,

  namespaced: function(namespace) {
    var oldOne = this
    var newOne = new Logger()
    newOne.namespace = (oldOne.namespace || '') + '[' + namespace + ']'
    return newOne
  },

  decorateArgs: function(args) {
    args = Array.prototype.slice.call(args)
    if (this.namespace) {
      args.unshift(this.namespace)
    }
    return args
  }
}

export default (new Logger()).namespaced('app')