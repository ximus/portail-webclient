import App from '../lib/app'
import util from '../lib/util'

Polymer({
  is: 'portail-drawer',

  properties: {
    user: Object
  },

  gotoGate: function() {
    var app = App.get
    app.gotoGate()
    this.close()
  },

  gotoProfile: function() {
    var app = App.get
    app.gotoProfile()
    this.close()
  },

  logout: function() {
    var app = App.get, drawer = this
    Auth.logout().then(function() {
      drawer.close()
      app.gotoHome()
    }).catch(function(e) {
      log("error logging out", e)
    })
  },

  close: function() {
    this.owner.closeDrawer()
  },

  get owner() {
    if (!this._owner)
      this._owner = util.dom.getClosest(this, 'paper-drawer-panel')
    return this._owner
  }
})