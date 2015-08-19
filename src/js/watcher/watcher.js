/**
 * Created by 01 Alchemist on 19/8/2015.
 */


var Watcher = function(){

    return {
        start:function(){
            window.camera.getVideoCamera('front').then(function(cam){
                var display = document.getElementsByTagName('video')[0];
                display.mozSrcObject = cam;
                display.play();
            })
        },
        stop:function(){
            window.camera.releaseCamera();
        }
    }
};

var _watcher = new Watcher();
_watcher.start();