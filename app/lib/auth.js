import App from '../lib/app'
import log from '../lib/log'
import profileSeedCache from '../lib/profile_seed_cache'

export default {
  handleLogin: function(response) {
    log("[Login]", response)
    var app = App.get
    if (response.user) { // user exists
      app.user = response.user
    } else { // identity created
      profileSeedCache(response.iid, response.signupSeed)
      app.iid = response.iid
    }
  },

  logout: function() {
    return fetch('/auth/logout', {
      method: 'post'
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