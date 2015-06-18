import Auth from '../lib/auth'
import App from '../lib/app'
import log from '../lib/log'
import util from '../lib/util'

Polymer({
  is: 'portail-login',

  ready: function() {
    var app = App.get
    this.app = app
    app.addEventListener('login', this.onLogin.bind(this))
  },

  loginClick: function(event) {
    var button = event.currentTarget
    this.loginWith(button.dataset.provider)
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
  },

  providerName: function(id) {
    return util.capitalize(App.get.i18n.auth[id].name)
  },

  providerBtnClass: function(id) {
    return "login-button self-center " + id
  },

  providerIcon: function(id) {
    return "providers:" + id
  }
})