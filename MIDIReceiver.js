const midi = require('midi'), util = require('util'), EventEmitter = require('events');

function MIDIReceiver(options) {
    if (!(this instanceof MIDIReceiver))
        return new MIDIReceiver(options);

    // Set up a new input.
    var input = this._input = new midi.input();

    const actions = {
        0x80: this._noteOff,
        0x90: this._noteOn,
        0xA0: this._polyphonicKeyPressure,
        0xB0: this._controlChange,
        0xC0: this._programChange,
        0xD0: this._channelPressure,
        0xE0: this._pitchBend
    }

    var self = this;
    input.on('message', function (deltaTime, message) {
        self.emit('clock', deltaTime);

        var status = message[0],
            action = status & 0xF0,
            channel = status & 0x0F;

        if (actions[action])
            actions[action].call(self, channel, message[1], message[2]);
    });

    // show clock
    input.ignoreTypes(true, false, true);

    // Create a virtual input port.
    input.openVirtualPort(options.name || 'NodeJS MIDI Receiver');
}
util.inherits(MIDIReceiver, EventEmitter);


// Configure a callback.

// The message is an array of numbers corresponding to the MIDI bytes:
//   [status, data1, data2]

/*
MIDI message includes a status byte and up to two data bytes.
Status byte
The most significant bit of status byte is set to 1.
The 4 low-order bits identify which channel it belongs to (four bits produce 16 possible channels).
The 3 remaining bits identify the message.
The most significant bit of data byte is set to 0.


Voice Message           Status Byte      Data Byte1          Data Byte2
-------------           -----------   -----------------   -----------------
Note off                      8x      Key number          Note Off velocity
Note on                       9x      Key number          Note on velocity
Polyphonic Key Pressure       Ax      Key number          Amount of pressure
Control Change                Bx      Controller number   Controller value
Program Change                Cx      Program number      None
Channel Pressure              Dx      Pressure value      None
Pitch Bend                    Ex      MSB                 LSB
*/

MIDIReceiver.prototype._noteOff = function (channel, key, velocity) {
    console.log('C %d: Note off %d with velocity %d', channel, key, velocity);
    this.emit('noteOff', channel, { key: key, velocity: velocity });
};

MIDIReceiver.prototype._noteOn = function (channel, key, velocity) {
    console.log('C %d: Note on %d with velocity %d', channel, key, velocity);
    this.emit('noteOn', channel, { key: key, velocity: velocity });
};

MIDIReceiver.prototype._polyphonicKeyPressure = function (channel, key, pressure) {
    console.log('C %d: Polyphonic pressure %d on key %d', channel, pressure, key);
    this.emit('polyphonicKeyPressure', channel, { key: key, pressure: pressure });
};

MIDIReceiver.prototype._controlChange = function (channel, number, value) {
    console.log('C %d: Control change %d, %d', channel, number, value);
    this.emit('controlChange', channel, { number: number, value: value });
};

MIDIReceiver.prototype._programChange = function (channel, program) {
    console.log('C %d: Program change to %s', channel, program);
    this.emit('programChange', channel, { program: program });
};

MIDIReceiver.prototype._channelPressure = function (channel, pressure) {
    console.log('C %d: Channel pressure to %d', channel, pressure);
    this.emit('channelPressure', channel, { pressure: pressure });
};

MIDIReceiver.prototype._pitchBend = function (channel, msb, lsb) {
    var bend = (msb << 8 ) | (lsb & 0xff);
    console.log('C %d: Pitch bend %d', channel, bend);

    this.emit('pitchBend', channel, { bend: bend });
};

MIDIReceiver.prototype.close = function () {
  this._input.closePort();
};


module.exports = MIDIReceiver;
