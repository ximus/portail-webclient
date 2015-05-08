import './ext/object_observe'
import './ext/array_wrap'
import '../vendor/fetch/fetch'

import ConfigObject from '../lib/config_object'
import log from '../lib/log'

log = log.namespaced('core')

var App = {
  get get() {
    if (!this._instance) {
      this._instance = document.querySelector('portail-app')
    }
    return this._instance
  },

  loadConfig: function() {
    var req = new XMLHttpRequest();
    req.open("GET", "/dna.json", true);
    req.onload = function (e) {
      if (req.status != 200) {
        log.error("failed to load config")
        return
      }
      Polymer.whenReady(function() {
        // for some reason I can't querySelector the app in this loop tick
        setTimeout(function() {
          var app = App.get
          var data = JSON.parse(req.response)
          app.config = new ConfigObject(data)
        })
      })
      log("loaded config")
    }
    req.send()
  },

  loadLocales: function() {
    var req = new XMLHttpRequest();
    req.open("GET", "/i18n.json", true);
    req.onload = function (e) {
      if (req.status != 200) {
        log.error("failed to load locales")
        return
      }
      Polymer.whenReady(function() {
        // for some reason I can't querySelector the app in this loop tick
        setTimeout(function() {
          var app = App.get
          var data = JSON.parse(req.response)
          app.i18n = new ConfigObject(data)
        })
      })
      log("loaded locales")
    }
    req.send()
  }
}

// get test() {
//   this.test = window.location.search.indexOf('test') >= 0;
//   this.offline = this.test || window.location.search.indexOf('offline') >= 0;
//   this.router = this.$.main
// }

if (window.dev || window.location.search.indexOf('test')) {
  App.testing = true
}

export default App
