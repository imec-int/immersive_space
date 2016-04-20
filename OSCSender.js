var osc = require('osc'),
    _ = require('lodash');


function OSCSender(options) {
    if (!(this instanceof OSCSender))
        return new OSCSender(options);

    var config = _.defaults(options || {}, {});

    // osc sender
    this._udpPort = new osc.UDPPort({
        localAddress: config.localAddress,
        localPort: config.localPort
    });

    this._address = config.address;
    this._host = config.host;
    this._port = config.port;

    // Open the socket.
    this._udpPort.open();
}

OSCSender.prototype = {
      //Convert coordinates
    _cartesian2Spherical: function (c) {
      var x = c.x, y = c.y, z = c.z;

      var r = Math.sqrt(x * x + y * y + z * z);
      var theta = Math.atan2(y, x); //This takes y first
      var phi = Math.atan2(Math.sqrt(x * x + y * y), z);

      return {
          r: r,
          theta: theta,
          phi: phi
      };
    },
    send: function (channel, position) {
      console.log('OSC: Sending %d,%d,%d over channel %d', position.x, position.y, position.z, channel);
      this.sendPolar(channel, this._cartesian2Spherical(position));
    },
    sendPolar: function (channel, position) {
        // Send an OSC message to, say, SuperCollider
        this._udpPort.send({
            address: this._address,
            args: [{
                type: "i",
                value: channel
            }, {
                type: "i",
                value: 4
            }, {
                type: "f",
                value: position.theta
            }, {
                type: "f",
                value: position.phi
            }, {
                type: "f",
                value: position.r
            }, {
                type: "f",
                value: 0.75
            }, {
                type: "f",
                value: 0.75
            }, {
                type: "f",
                value: 0
            }, {
                type: "i",
                value: 0
            }, {
                type: "i",
                value: 0
            }, {
                type: "f",
                value: 0
            }, {
                type: "i",
                value: 0
            }]
        }, this._host, this._port);
    },

    close: function () {
      this._udpPort.close();
    }
}

module.exports = OSCSender;
