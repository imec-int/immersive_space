var midi = require('midi'),
    OSCSender = require('./OSCSender.js'),
    MIDIReceiver = require('./MIDIReceiver.js'),
    fs = require('fs');

// Get command line parameters
var args = process.argv.slice(2);

// Read config
var config = JSON.parse(fs.readFileSync(args[0] || 'config.json', 'utf8'));

// Setup OSC to IOSONO
var oscSender = new OSCSender(config.osc);

// Setup MIDI
var midiReceiver = new MIDIReceiver(config.midi);

// Setup position to send
var position = {x: 0, y: 0, z: 0}, ranges = config.midi.ranges;

midiReceiver.on('noteOn', function (channel, key, velocity) {
  console.log('C %d: Note on %d with velocity %d', channel, key, velocity);

  // Calculate X percentage
  var pX = getPercentageInBounds(key, ranges.x);
  position.x = config.width * pX;

  // Calculate Y percentage
  var pY = getPercentageInBounds(velocity, ranges.y);
  position.y = config.height * pY;

  oscSender.send(channel, position);
});

midiReceiver.on('channelPressure', function (channel, pressure) {
  console.log('C %d: Channel pressure to %d', channel, pressure);

  // Calculate Z percentage
  var pZ = getPercentageInBounds(pressure, ranges.z);
  position.z = config.depth * pZ;

  oscSender.send(channel, position);
});

function getPercentageInBounds(val, range) {
  var min = range[0], max = range[1];

  var p = val - min; // lower bound
  p = p < 0 ? 0 : p;
  p = p > (max - min) ? (max - min) : p;

  return p / (max - min);
}
