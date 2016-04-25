var osc = require('osc'),
    _ = require('lodash');

function OSCSender(options) {
    if (!(this instanceof OSCSender))
        return new OSCSender(options);

    var config = _.defaults(options || {}, {});

    // osc sender
    this._udpPort = new osc.UDPPort({
        localAddress: config.localAddress || '0.0.0.0',
        localPort: config.localPort || 5001
    });

    this._address = config.address || '/iosono';
    this._host = config.host || '192.168.0.1';
    this._port = config.port || 4001;

    // Open the socket.
    this._udpPort.open();
}

OSCSender.prototype = {
    //Convert coordinates
    _cartesian2Spherical: function (c) {
        var x = c.x,
            y = c.y,
            z = c.z;

        var r = Math.sqrt(x * x + y * y + z * z);
        var theta = Math.atan2(y, x); //This takes y first
        var phi = Math.atan2(z, Math.sqrt(x * x + y * y));

        return {
            r: r,
            theta: theta,
            phi: phi
        };
    },

    _createMessage: function (position, channel) {
        return {
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
        };
    },

    _createBundle: function (positions) {
        return {
            timeTag: osc.timeTag(0),
            packets: positions.map(this._createMessage, this)
        };
    },

    send: function (position, channel) {
        this.sendSpherical(this._cartesian2Spherical(position), channel);
    },

    sendSpherical: function (position, channel) {
        this._udpPort.send(this._createMessage(position, channel), this._host, this._port);
    },

    sendBundled: function (positions) {
        this.sendBundledSpherical(positions.map(this._cartesian2Spherical));
    },

    sendBundledSpherical: function (positions) {
        this._udpPort.send(this._createBundle(positions), this._host, this._port);
    },

    close: function () {
        this._udpPort.close();
    }
}

module.exports = OSCSender;
