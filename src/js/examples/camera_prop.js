window.addEventListener('ready', () => {
  window.cameraProp = {

    cameraApi : navigator.mozCameras || navigator.mozCamera,

    getFileFormats:function(callback){

      var id = this.cameraApi.getListOfCameras()[0];
      var options = {
        mode: 'picture'
      }

      function onSuccess(camera) {
        var formats = camera.capabilities.fileFormats;

        if(callback)callback(formats);

        formats.forEach(function (value) {
          console.log(value);
        });
        camera.release();
      };

      function onFail(error){
        console.log(error);
      };

      var cameraReq = this.cameraApi.getCamera(id, options,  onSuccess, onFail);
      if (cameraReq && cameraReq.then) {
        cameraReq.then(params => {
          onSuccess(params.camera);
        }, onFail);
      }
    },

    getSizes:function(callback){

      var id = this.cameraApi.getListOfCameras()[0];
      var options = {
        mode: 'picture'
      }

      function onSuccess(camera) {
        var sizes = camera.capabilities.pictureSizes;

        if(callback)callback(sizes);

        sizes.forEach(function (size) {
          console.log(size.width + 'x' + size.height);
        });
        camera.release();
      };

      function onFail(error){
        console.log(error);
      };

      var cameraReq = this.cameraApi.getCamera(id, options,  onSuccess, onFail);
      if (cameraReq && cameraReq.then) {
        cameraReq.then(params => {
          onSuccess(params.camera);
        }, onFail);
      }
    }
  };

  console.log('CameraProp ready');
});
