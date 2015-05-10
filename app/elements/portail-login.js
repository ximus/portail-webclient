import Auth from '../lib/auth'
import App from '../lib/app'
import log from '../lib/log'


Polymer('portail-login', {
  get app() {
    return App.get
  },

  ready: function() {
    this.app.addEventListener('login', this.onLogin.bind(this))
  },

  capitalize: function(string) {
    if (!string) return ''
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  loginClick: function(event, detail, sender) {
    this.loginWith(sender.attributes['data-provider'].value)
  },

  loginWith: function(providerID) {
    var width = 400
    var height = 600
    var left = (screen.width/2)-(width/2);
    var top = (screen.height/2)-(height/2);
    var provider = Auth.findProvider(providerID)
    var url = Auth.config.url(provider)
    window.open(url, name, "menubar=no,toolbar=no,status=no,width="+width+",height="+height+",toolbar=no,left="+left+",top="+top);
  },

  onLogin: function(event) {
    var app = App.get
    if (app.user) { // user exists
      app.gotoHome()
    } else { // user needs to confirm profile
      app.gotoProfile()
    }
  },

  faID: function(id) {
    if (id.match(/(windows|microsoft)/)) return 'windows'
    if (id.match(/google/)) return 'google'
    return id
  }
});