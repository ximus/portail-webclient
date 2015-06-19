import Auth from '../lib/auth'
import App from '../lib/app'
import log from '../lib/log'


// used by the server to send data
// the idea is to provide a general facility
// for the server to tag data along any request to the
// client where any module can listen for this data.
window.notifyApp = function(event, data) {
  var app = App.get
  app.fire(event, data)
}

Polymer({
  is: "portail-app",

  properties: {
    config: {
      type: Object,
      observer: 'configChanged'
    },
    iid: String,
    user: {
      type: Object,
      value: null
    },
    authenticated: {
      type: Boolean,
      computed: 'defined(user)'
    },
    selected: {
      type: String,
      value: 'splash'
    }
  },

  // helps cast non boolean properties in view bindings
  defined: function(a) { return !!a },

  connected: false,
  minSplashTime: 1000,

  ready: function() {
    App.notifyReady()

    // this.test = window.location.search.indexOf('test') >= 0;
    // this.offline = this.test || window.location.search.indexOf('offline') >= 0;
    this.router = this.$.router

    this.readyTime = Date.now()

    this.whenConfigReady(function() {
      this.startup()
    }.bind(this))

    Auth.init()

    if (App.testing) {
      window.app = this
    }
  },

  startup: function() {
    var elapsed = Date.now() - this.readyTime;
    var t = this.minSplashTime - elapsed;

    this.async(this.completeStartup, t > 0 ? t : 0);
  },

  completeStartup: function() {
    this.router.init()
    this.selected = 'main'
    log("startup complete")
  },

  configChanged: function(config) {
    if (config) {
      this.iid = this.config.iid
      this.user = this.config.userInfo
      let cb;
      while (cb = this._configReadyCallbacks.pop()) cb()
    }
  },

  _configReadyCallbacks: [],

  whenConfigReady: function(callback) {
    if (this.config) {
      callback()
    }
    else {
      // this is a performance killer in polyfilled browsers
      // this.observeProperty('config', callback)
      this._configReadyCallbacks.push(callback)
    }
  },

  routeChanged: function(event) {
    log("routeChanged()")
    var path = event.detail.path
    if (path == '/') {
      event.preventDefault()
      this.gotoGate();
    }
    if (this.user) {
      return
    }
    if (path == '/profile' && this.iid) {
      return
    }
    if (path == '/login') {
      return
    }
    event.preventDefault()
    this.gotoLogin();
  },

  gotoHome: function() {
    this.gotoGate()
  },

  gotoGate: function() {
    this.router.go('/gate')
  },

  gotoLogin: function() {
    this.router.go('/login')
  },

  gotoProfile: function() {
    this.router.go('/profile')
  }
});