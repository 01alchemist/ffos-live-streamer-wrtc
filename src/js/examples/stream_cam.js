window.addEventListener('ready', () => {
  window.streamCam = {

    _camera: null,

    cameraApi : navigator.mozCameras || navigator.mozCamera,

    start:function(callback){

      var scope = this;

      var display = document.getElementsByTagName('video')[0];
      var id = this.cameraApi.getListOfCameras()[1];
      var options = {
        mode: 'video'
      };

      function onStreamReady( stream ) {

      }

      console.log('using '+id+' camera');

      function onAccessCamera( camera ) {
        scope._camera = camera;
        console.log('got camera');
        var size = camera.capabilities.previewSizes[0];
        console.log('got preview size:',size);

        display.mozSrcObject = camera;
        display.play();

      }

      function onFail(error){
        console.log(error);
      }

      var cameraReq = this.cameraApi.getCamera(id, options,  onAccessCamera, onFail);
      if (cameraReq && cameraReq.then) {
        cameraReq.then(params => {
          onAccessCamera(params.camera);
        }, onFail);
      }
    },

    stop: function() {
      this._camera.release();
    }
  };

  console.log('Stream Cam ready');
});
