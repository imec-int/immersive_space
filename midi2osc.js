var midi = require('midi'),
    OSCSender = require('./OSCSender.js');
    fs = require('fs');

// Read config
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Setup OSC to IOSONO
var oscSender = new OSCSender(config);

// Set up a new input.
var input = new midi.input();

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

var position = {x: 0, y: 0, z: 0};

function noteOff(channel, key, velocity) {
  console.log('C %d: Note off %d with velocity %d', channel, key, velocity);
}

function noteOn(channel, key, velocity) {
  console.log('C %d: Note on %d with velocity %d', channel, key, velocity);

  var offset = config.midi.offset;

  // Calculate X percentage
  var pX = key - offset;
  pX = pX < 0 ? 0 : pX;
  pX = pX > 10 ? 10 : pX;

  // Calculate Y percentage
  var pY = velocity > 100 ? 100 : velocity;

  position.x = config.width * (pX/10);
  position.y = config.height * (pY/100);

  oscSender.send(channel, position);
}

function polyphonicKeyPressure(channel, key, pressure) {
  console.log('C %d: Polyphonic pressure %d on key %d', channel, pressure, key);
}

function controlChange(channel, number, value) {
  console.log('C %d: Control change %d, %d', channel, number, value);
}

function programChange(channel, program) {
  console.log('C %d: Program change to %s', channel, program);
}

function channelPressure(channel, pressure) {
  console.log('C %d: Channel pressure to %d', channel, pressure);

  // Calculate Z percentage
  var pZ = pressure > 100 ? 100 : pressure;

  position.z = config.depth * (pZ/100);
  oscSender.send(channel, position);
}

function pitchBend(channel, msb, lsb) {
  var bend = msb * 255 + lsb;
  console.log('C %d: Pitch bend %d %d', channel, bend);
}

var actions = {
  0x80: noteOff,
  0x90: noteOn,
  //0xA0: polyphonicKeyPressure,
  //0xB0: controlChange,
  //0xC0: programChange,
  0xD0: channelPressure,
  //0xE0: pitchBend
}

input.on('message', function(deltaTime, message) {
    console.log('Clock: ' + deltaTime);

    var status = message[0],
        action = status & 0xF0,
        channel = status & 0x0F;

    if (actions[action])
      actions[action](channel, message[1], message[2]);
});

// Create a virtual input port.
input.openVirtualPort(config.midi.name);

// A midi device  is now available for other
// software to send messages to.

// ... receive MIDI messages ...

// Close the port when done.
//input.closePort();
