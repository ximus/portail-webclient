import App from '../lib/app'
import log from '../lib/log'

// log = log.namepsaced('gate')

var OPENING = 'opening',
    OPEN    = 'open',
    CLOSED  = 'closed',
    CLOSING = 'closing'


Polymer('portail-gate', {
  publish: {
    state: {value: null, reflect: true},
    // viewState reflects the visual state of the gate,
    // it reflects the state of animations and may lag
    // behind the real gate state
    viewState: {value: null, reflect: true}
  },

  computed: {
    isReady: "state && state != 'unknown'"
  },

  state: null,
  position: null,
  ws: null,

  ready: function() {
    // SVGInjector(this.$['gate-vector'])

    var gate = this.$['the-gate-part']
    gate.addEventListener("transitionend", this.onGateAnimationEnd.bind(this), false)

    var config = App.get.config
    var ws = new WebSocket(config.ws_url)
    this.ws = ws

    ws.onmessage = function(event) {
      var status = JSON.parse(event.data)
      log("got status update", status)
      this.updateStatus(status)
    }.bind(this)

    // When the connection is open, se nd some data to the server
    ws.onopen = function () {
      log('WebSocket OPEN');
    }

    // Log errors
    ws.onerror = function (error) {
      log('WebSocket Error ' + error);
    }

    ws.onclose = function (d) {
      log('WebSocket closed ', d);
    }


    // client.on('transport:down', function() {
    //   // the client is offline
    // });

    // client.on('transport:up', function() {
    //   // the client is online
    // });
  },

  toggleGate: function() {
    this.ws.send(JSON.stringify({
      action: this.buttonState
    }))
  },

  updateStatus: function(status) {
    this.state = status.state
    this.position = status.position
  },

  stateChanged: function() {
    if (this.state === CLOSED ||
        this.state === CLOSING) {
      this.buttonState = 'open'
    } else {
      this.buttonState = 'close'
    }
  },

  positionChanged: function() {
    this.moveGateTo(this.position)
  },

  moveGateTo: function(position) {
    var gate = this.$['the-gate-part']
    var gateWidth = gate.getBBox().width
    var x = position * gateWidth
    var transform = 'translateX(' + x + 'px)'

    gate.style.webkitTransform = gate.style.transform = transform
    this.onGateAnimationStart()
  },

  onGateAnimationStart: function() {
    this.viewState = this.state
  },

  onGateAnimationEnd: function() {
    this.viewState = this.state
  },

  formatState: function(state) {
    switch(state) {
      case OPENING:
        return 'Ouverture'
      case CLOSING:
        return 'Fermeture'
      case OPEN:
        return 'Ouvert'
      case CLOSED:
        return 'Fermé'
      default:
        return '...'
    }
  }
});