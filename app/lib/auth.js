import App from '../lib/app'
import log from '../lib/log'
import profileSeedCache from '../lib/profile_seed_cache'

export default {

  init: function() {
    var app = App.get
    app.addEventListener('login', this.onLogin.bind(this))
    app.addEventListener('logout', this.onLogout.bind(this))
  },

  onLogin: function(event) {
    var response = event.detail
    log("[Login]", response)
    var app = App.get
    if (response.user) { // user exists
      app.user = response.user
    } else { // identity created
      profileSeedCache(response.iid, response.signupSeed)
      app.iid = response.iid
    }
  },

  onLogout: function(event) {
    var app = App.get
    app.iid = app.user = null
  },

  logout: function() {
    return fetch('/auth/logout', {
      method: 'POST',
      credentials: "same-origin"
    }).then(function() {
      App.get.fire('logout')
    })
  },

  get config() {
    var app = App.get
    return app.config && app.config.auth
  },

  findProvider: function(providerID) {
    for (var i = this.config.providers.length - 1; i >= 0; i--) {
      var provider = this.config.providers[i];
      if (provider.id === providerID) return provider
    }
  }
}