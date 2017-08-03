#IOSONO STARTUP SEQUENCE

Basic template for using the immersive space setup at de krook
## make sure all speakers are off
# SERIOUSLY


## network setup
connect to the wired rednet network
give yourself any non conflicting 192.168.1.XX IP
the IOSONO has 192.168.1.10, the rednets are in an other range,


## rednet

- boot rednet 2 and 6 and iosono
- isosono kriookimmersivespace

## speakers
- power on speakers 
- ...

## software

1. dante virtual sound card  (if needed) ==> 64x64
2. dante controller (load preset DanteSetupImmersiveSpace.xml) 

### to use midi positioning
install https://github.com/krooklab/midi2iosono and RTFM

when up and running start your DAW, ableton, puredata, ... and send midi and audio over 8 channels



# diagnosing a problem

use rednet control 2 to check for the whole connection chain

if rednet 6 gives output signal but no sound CHECK COAXIAL CABLE



### IOSONO update for phosphotron
Some information was given up here, but again short summary and some sidenotes
## Dante Virtual Souncard
make sure your PC has a fixed IP (192.168.1.11)

64x64 channels
## Dante Controller
Load correct patch and check flow:

PC/Mac ==> Rednet 6 ==> RedNet2_1/2/3/4
## Midi2IOsono
broncode at GIT, also  template for the phospotron setup

in this template: midi cc 10 = x, 11 = y, 12 = z
## Rednet2 Control software
Check for RN6 to be master

furthermore monitoring tool
## Ableton Live
audiosettings: (CTRL+,) input & output Dante Virtual Soundcard

Output config: make sure all outputs as mono, as well 1/2 stereo

Midi: all outputs to midi2Iosono (if not there, midi2iosono not running or crashed)

## IOSono software
Password symbol Iosono

Run correct patch

I/O Ctrl: MADI inputs available?

Check third horizontal menu for monitoring of soundobject placement

