import ConfigObject from '../lib/config_object'
import App from '../lib/app'

Polymer({
  is: 'portail-datastore',

  dataChanged: function() {
    var app = App.get
    app.config = new ConfigObject(this.data)
  },

  i18nChanged: function() {
    var app = App.get
    app.i18n = new ConfigObject(this.i18n)
  }
})