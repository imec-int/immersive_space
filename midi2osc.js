var midi = require('midi'),
    OSCSender = require('./OSCSender.js'),
    MIDIReceiver = require('./MIDIReceiver.js'),
    fs = require('fs');

// Get command line parameters
var args = process.argv.slice(2);

// Read config
var config;
try {
  config = JSON.parse(fs.readFileSync(args[0] || 'config.json', 'utf8'));
} catch (error) {
  console.log('No config.json given or found');
  process.exit(1);
}

// Setup OSC to IOSONO
var oscSender = new OSCSender(config.osc);

// Setup MIDI
var midiReceiver = new MIDIReceiver(config.midi);

// Setup position to send
var positions = [], ranges = config.midi.ranges;
for (var i = 0; i < 16; i++) {
  positions[i] = {x: 0, y: 0, z: 0};
}

midiReceiver.on('clock', function (deltaTime) {
  if (config.bundled){
      oscSender.sendBundled(positions);
  } else {
      positions.forEach(oscSender.send, oscSender);
  }
});

midiReceiver.on('noteOn', function (channel, key, velocity) {
  console.log('C %d: Note on %d with velocity %d', channel, key, velocity);

  // Calculate X percentage
  var pX = getPercentageInBounds(key, ranges.x);
  positions[channel].x = config.width * pX;

  // Calculate Y percentage
  var pY = getPercentageInBounds(velocity, ranges.y);
  positions[channel].y = config.height * pY;
});

midiReceiver.on('channelPressure', function (channel, pressure) {
  console.log('C %d: Channel pressure to %d', channel, pressure);

  // Calculate Z percentage
  var pZ = getPercentageInBounds(pressure, ranges.z);
  positions[channel].z = config.depth * pZ;
});

function getPercentageInBounds(val, range) {
  var min = range[0], max = range[1];

  var p = val - min; // lower bound
  p = p < 0 ? 0 : p;
  p = p > (max - min) ? (max - min) : p;

  return p / (max - min);
}
