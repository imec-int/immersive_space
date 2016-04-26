# midi2iosono: control Barco IOSONO using MIDI signals
## Installing midi2iosono
To install, please make sure [NodeJS](https://nodejs.org/en/) >= 4.0.0 and optionally [git](https://git-scm.com) are installed. Run the following commands in bash:

```bash
git clone https://github.com/krooklab/midi2iosono.git
# or wget https://github.com/krooklab/midi2iosono/archive/master.zip; unzip master.zip
cd midi2iosono
npm install
```

## Configuring midi2iosono
Before running _midi2iosono_, a configuration JSON file needs to be prepared.

### IOSONO parameters

parameter      | type      | description                                                                                                                    | default
-------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------
`measurements` | `Object`  | An object containing the measurements of the IOSONO speaker setup, specified for each axis. Each value is specified in meters. | `{ "x": 10, "y": 10, "z": 10 }`
`bundled`      | `boolean` | When `true`, all channel positions are sent as a OSC bundle.                                                                   | `false`
`channels`     | `Number`  | The number of channels to send to iosono, starting from 0.                                                                     | `16`
`host`         | `String`  | The IP address of the IOSONO.                                                                                                  | `"192.168.0.1"`
`port`         | `String`  | The port of the IOSONO.                                                                                                        | `4001`
`localAddress` | `String`  | The IP address to send OSC messages from.                                                                                      | `"0.0.0.0"`
`localPort`    | `String`  | The port to send OSC messages from.                                                                                            | `5001`
`address`      | `String`  | The IOSONO address.                                                                                                            | `"/iosono"`

### MIDI parameters

parameter | type     | description                                   | default
--------- | -------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------
`name`    | `String` | The name of the Virtual MIDI device.          | `"IOSONO MIDI Receiver"`
`mapping` | `Object` | The mapping of MIDI events on 3D coordinates. | `{ noteOn: { x: { key: [60, 80] }, y: { velocity: [0, 100] }}, channelPressure: { z: { pressure: [0, 100] }}}`

The `mapping` object is a cascade of objects, following the following pattern:

```
"<MIDI event>": {
    "<coordinate>": {
        "<parameter>": [<min_range>, <max_range>]
        }
    }
```

Possible values for `<MIDI_event>` and associated `parameter` are:

MIDI event            | Parameters
--------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------
noteOff               | `key`, `velocity`
noteOn                | `key`, `velocity`
polyphonicKeyPressure | `key`, `pressure`
controlChange         | This a special case, where the parameter is the sent control change `number`. For example, a control change message with number 13 will be `"13": [ ... ]`
programChange         | `number`
channelPressure       | `pressure`
pitchBend             | `bend`

The key `<coordinate>` has to be `"x"`, `"y"` or `"z"`. The array `[<min_range>, <max_range>]`contains two numbers in which the value of this parameter can vary. This range spans 0 - 100% of what is specified in the  ISONO `measurements` setting.

A complete config example is given below.

```json
{
    "iosono": {
        "measurements": {
            "x": 10,
            "y": 10,
            "z": 10
        },
        "bundled": false,
        "channels": 1,
        "host": "192.168.0.1",
        "port": 3333,
        "localAddress": "0.0.0.0",
        "localPort": 2222,
        "address": "example.org/iosono"
    },
    "midi": {
        "name": "MIDI-2-IOSONO",
        "mapping": {
            "noteOn": {
              "y": {
                "velocity": [0, 100]
              }
            },
            "controlChange": {
              "x": {
                "12" : [0, 100]
              }
            },
            "pitchBend": {
               "z": {
                 "bend": [0, 100]
                }
            }
        }
    }
}
```

## Running midi2iosono
You can simply run _midi2iosono_ in bash.

`./midi2iosono [config.json]`

The config file can be supplied as a command line parameter or put as `config.json` in the working directory. If all goes well, you should see `midi2iosono ready and running as MIDI device: IOSONO MIDI Receiver` in your terminal.
