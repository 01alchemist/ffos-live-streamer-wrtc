/**
 * Created by 01Alchemist on 8/18/15.
 */
var config = {
    openSocket: function(config) {
        // https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md
        // This method "openSocket" can be defined in HTML page
        // to use any signaling gateway either XHR-Long-Polling or SIP/XMPP or WebSockets/Socket.io
        // or WebSync/SignalR or existing implementations like signalmaster/peerserver or sockjs etc.

        var channel = config.channel || location.href.replace( /\/|:|#|%|\.|\[|\]/g , '');
        var socket = new Firebase('https://webrtc.firebaseIO.com/' + channel);
        socket.channel = channel;
        socket.on('child_added', function(data) {
            config.onmessage(data.val());
        });
        socket.send = function(data) {
            this.push(data);
        };
        config.onopen && setTimeout(config.onopen, 1);
        socket.onDisconnect().remove();
        return socket;
    },
    onRemoteStream: function(media) {

    },
    onRoomFound: function(room) {

    }
};

var _broadcast = new broadcast(config);

console.log('///////////////////////////////\n' +
            '// Broadcast started...      //\n' +
            '///////////////////////////////');

captureUserMedia(function() {
    _broadcast.createRoom({
        roomName: 'agent-peak-stream'
    });
});

function captureUserMedia(callback) {
    window.streamCam.start();
}