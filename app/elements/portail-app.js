import Auth from '../lib/auth'
import App from '../lib/app'
import log from '../lib/log'

PolymerExpressions.prototype.i18n = function() {
  return App.get.i18n
}

Polymer("portail-app", {
  selected: 'splash',
  connected: false,
  minSplashTime: 1000,

  ready: function() {
    // this.test = window.location.search.indexOf('test') >= 0;
    // this.offline = this.test || window.location.search.indexOf('offline') >= 0;
    this.router = this.$.router

    this.readyTime = Date.now()

    this.whenConfigReady(function() {
      this.startup()
    }.bind(this))

    if (App.testing) {
      window.app = this
    }
  },

  // eventDelegates: {
  //   'main': 'gotoGate'
  // },

  startup: function() {
    var elapsed = Date.now() - this.readyTime;
    var t = this.minSplashTime - elapsed;

    this.async('completeStartup', null, t > 0 ? t : 0);
  },

  completeStartup: function() {
    this.router.init()
    this.selected = 'main'
    log("started")
  },

  configChanged: function() {
    this.iid = this.config.iid
    this.user = this.config.userInfo
    this._configReadyCallbacks.forEach(function(callback) {
      callback()
    })
  },

  _configReadyCallbacks: [],

  whenConfigReady: function(callback) {
    if (this.config) {
      callback()
    }
    else {
      // this is a performance killer in FF and SF
      // this.observeProperty('config', callback)
      this._configReadyCallbacks.push(callback)
    }
  },

  routeChanged: function(event) {
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
  },

  logout: function() {
    Auth.logout().then(function() {
      this.gotoHome()
      this.user = null
    }).catch(function() {
      // TODO: log error
      alert('une erreur est survenue pendant la deconnexion')
    })
  }
});