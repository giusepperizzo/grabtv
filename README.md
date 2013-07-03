# Grab your Favorite Video Fragment: Interact with a Kinect and Discover Enriched Hypervideo 


In this demonstration, we propose an approach for enriching the user experience when watching television using a second screen device. The user can control the video program being watched using a Kinect and can grab, at any time, a fragment from this video. Then, we perform named entity recognition on the subtitles of this video fragment in order to spot relevant concepts. Entities are used to gather information from the Linked Open Data cloud and to discover what the vox populi says about this program. This generates media galleries that enrich the seed video fragments grabbed by the user who can then navigate this enriched content on a second screen device.

Project by LinkedTV & Eurecom

Demo video: [http://www.youtube.com/watch?v=4mSC685AG7k]()

## Architecture

1. HTML rendering source server

2. Broadcast controller

3. Client(s)

4. Websocket server


## Step to run

### Preliminary steps
1. Install and run NodeJS: http://nodejs.org/
2. Install Kinesis.IO : http://kinesis-io.github.io/
3. Connect the Kinect device to your computer and make sure it works

### Run 
1. Start server-controller.js
2. Start server-html.js
3. Open web page video-controller.html first at port 8000
4. Open web page video-client.html second at port 8000

### Gesture
- Hold your hand on the thumbnail --> Click video
- Swipe down : Stop (grab) the video
- Swipe up: Play the video
- Swipe left: forward
- Swipe right: backward

