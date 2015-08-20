
// initializing RTCMultiConnection constructor.
function initRTCMultiConnection(userid) {
    console.log('rtc inited');
    var connection = new RTCMultiConnection();
    connection.body = document.getElementById('videos-container');
    connection.channel = connection.sessionid = connection.userid = userid || connection.userid;
    connection.session = {
        video: true,
        screen: false,
        oneway: true
    };
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: true
    };
    // using socket.io for signaling
    connection.openSignalingChannel = function (config) {
        var channel = config.channel || this.channel;
        onMessageCallbacks[channel] = config.onmessage;
        if (config.onopen) setTimeout(config.onopen, 1000);
        return {
            send: function (message) {
                socket.emit('message', {
                    sender: connection.userid,
                    channel: channel,
                    message: message
                });
            },
            channel: channel
        };
    };
    connection.onMediaError = function(error) {
        alert( JSON.stringify(error) );
    };
    return connection;
}

// this RTCMultiConnection object is used to connect with existing users
var connection = null;
var socket = null;
var onMessageCallbacks = {};

function initRTC(callback){
  try{
    socket = io.connect('http://01alchemist.ddns.net:3000');
      console.log('socket inited');
  }catch(e){
      console.log(e);
  }
  // using single socket for RTCMultiConnection signaling

  socket.on('message', function(data) {
      console.log('got socket message:',data);
      if(data.sender == connection.userid) return;
      if (onMessageCallbacks[data.channel]) {
          onMessageCallbacks[data.channel](data.message);
      };
  });

  connection = initRTCMultiConnection();
  console.log('rtc created');

  connection.onstream = function(event) {
    console.log('got onstream event');
      connection.body.appendChild(event.mediaElement);

      if(connection.isInitiator == false && !connection.broadcastingConnection) {
          // "connection.broadcastingConnection" global-level object is used
          // instead of using a closure object, i.e. "privateConnection"
          // because sometimes out of browser-specific bugs, browser
          // can emit "onaddstream" event even if remote user didn't attach any stream.
          // such bugs happen often in chrome.
          // "connection.broadcastingConnection" prevents multiple initializations.

          // if current user is broadcast viewer
          // he should create a separate RTCMultiConnection object as well.
          // because node.js server can allot him other viewers for
          // remote-stream-broadcasting.
          connection.broadcastingConnection = initRTCMultiConnection(connection.userid);
          connection.broadcastingConnection.attachStreams.push(event.stream); // broadcast remote stream
          connection.broadcastingConnection.dontCaptureUserMedia = true;
          connection.broadcastingConnection.sdpConstraints.mandatory.OfferToReceiveVideo = false;
          connection.broadcastingConnection.open({
              dontTransmit: true
          });
      }
  };

  // ask node.js server to look for a broadcast
  // if broadcast is available, simply join it. i.e. "join-broadcaster" event should be emitted.
  // if broadcast is absent, simply create it. i.e. "start-broadcasting" event should be fired.


  // this event is emitted when a broadcast is already created.
  socket.on('join-broadcaster', function(broadcaster) {
    console.log('got join-broadcast');
      connection.channel = connection.sessionid = broadcaster.userid;
      connection.join({
          sessionid: broadcaster.userid,
          userid: broadcaster.userid,
          extra: {},
          session: connection.session
      });
  });

  // this event is emitted when a broadcast is absent.
  socket.on('start-broadcasting', function() {
    console.log('got start-broadcast');
      connection.sdpConstraints.mandatory.OfferToReceiveVideo = false;
      connection.open({
          dontTransmit: true
      });
  });

  callback();
}
