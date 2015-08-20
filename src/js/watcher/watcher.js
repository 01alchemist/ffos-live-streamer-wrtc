/**
 * Created by 01 Alchemist on 19/8/2015.
 */


var Watcher = function(){

    return {
        start:function(){
            initRTC(function(){
              console.log('emitted join-broadcast');
              try{
                socket.emit('join-broadcast', {
                    broadcastid: "test1",
                    userid: connection.userid
                });
              }catch(e){
                console.log(e);
              }
            });

            /*window.camera.getVideoCamera('front').then(function(cam){
                /!*var display = document.getElementsByTagName('video')[0];
                display.mozSrcObject = cam;
                display.play();*!/
                socket.emit('join-broadcast', {
                    broadcastid: "agent-peak-stream",
                    userid: connection.userid
                });
            })*/
        },
        stop:function(){
            window.camera.releaseCamera();
        }
    }
};

var _watcher = new Watcher();

window.addEventListener('WIFI_READY', function () {
    _watcher.start();
});
