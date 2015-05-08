var User = function(attrs) {
  this.attrs = attrs
}

User.prototype = {
  get isNew() {
    return this.attr
  }
}