# Immersive space docs
# De Krook, Ghent, floor -2

# setup Unity to Ableton/reaper
Unity: OSC to start ableton/reaper: 

- make sure the sending IP is towards the Audio laptop
- check firewall connections
- Ableton:
- send OSC message with address "/start", value: 0 or 1
- Reaper:
- send OSC message with address "/play 1" or "/stop 1"

# Rednet
have hardcoded IP on network 10.10.140.70-73/22

# iosono
IP: 10.10.140.40/22
Clock: wordclock (IPEM)

# Ableton to IOsono
make sure plugin uses correct IP of iosono