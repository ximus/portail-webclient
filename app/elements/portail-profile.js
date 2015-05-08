import App from '../lib/app'
import profileSeedCache from '../lib/profile_seed_cache'
import log from '../lib/log'

Polymer('portail-profile', {
  profile: {},

  get app() {
    return App.get
  },

  observe: {
    'app.iid app.user':  'reloadProfile'
  },

  ready: function() {
    this.reloadProfile()
  },

  reloadProfile: function() {
    var app = App.get

    if (app.user) {
      this.profile = app.user
    }
    else if (app.iid) {
      // load any cached profile
      this.profile = profileSeedCache(app.iid)
    }
    else {
      this.profile = {}
    }
  },

  handleProfileConfirm: function() {
    // $http.put('/profile', {profile: $scope.profile}).success(function(response) {
    //   var isNewUser = false
    //   if (!$scope.auth.currentUser) isNewUser = true
    //   $scope.auth.currentUser = response.data
    //   if (isNewUser) Routes.gotoHome()
    // })
    var app = App.get
    var isNewUser = !app.user
    var req = new XMLHttpRequest()
    req.open("PUT", "/profile", true)
    req.onload = function (e) {
      if (req.status != 200) {
        log.error("failed to save profile")
        return
      }
      app.user = JSON.parse(req.response)
      app.gotoHome()
      log("profile saved")
    }
    var data = { profile: this.profile }
    req.send(JSON.stringify(data))
  }
});