var io = require('socket.io-client')('http://localhost:3000');
_ = require('lodash');
var datasocket; 
console.log(datasocket);

function WSSender(options) {
    if (!(this instanceof WSSender))
        return new WSSender(options);
    var config = _.defaults(options || {}, {});
    // init websocket to aframe

    //socket.connect('http://localhost:3000');
    console.log('CONNECTING ....');
    io.on('connect', function(){
            console.log('CONNECTED!');
           // datasocket = socket;
           //console.log(io);
           io.emit('hello', {users: ["mat","rob"], company:"imec"});
    });
   // socket.emit('hello', {users: ["mat","rob"], company:"imec"});
}

WSSender.prototype = {
// SOCKET.IO
    initSockets: function(){
    ///socket.connect('http://localhost:3000');
    io.emit('hello', {users: ["mat","rob"], company:"imec"});

    },

    send: function (position, channel) {
        //console.log('Emitting ....');
        io.emit('iosono', {position: position, channel: channel});
    }
}

module.exports = WSSender;
