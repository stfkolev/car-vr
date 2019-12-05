'use strict';

var camera_1 = require('./Controls/CameraControl');
var binocs_1 = require('./Utility/Binocs');
var CarBody_1 = require('./Car/CarBody');
var CarProps_1 = require('./Car/CarProps');
var grid_1 = require('./Grid');
var Utils = require('./Utility/Utils');

var Model = function () {
  function Model(_main) {
    this.deviceAngle = 0;
    this.pageMain = _main;
    this.vpW = this.pageMain.clientWidth;
    this.vpH = this.pageMain.clientHeight;
    this.props = new CarProps_1.CarProps();
    this.camTarget = new THREE.Vector3(0, 1, 1.56);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.vpW, this.vpH);
    this.renderer.setClearColor(0x393533);
    this.renderer.autoClear = false;
    this.camOptions = {
      distance: 7,
      focusPos: this.camTarget,
      distRange: {
        max: 40,
        min: 4
      },
      rotation: new THREE.Vector3(45, 0, 0),
      rotRange: {
        yMin: -1
      },
      eyeSeparation: 0.3
    };

    this.monoc = new camera_1.default(this.camOptions);
    this.cam = this.monoc;
    this.grid = new grid_1.default(this.scene, this.renderer);
    this.pageMain.appendChild(this.renderer.domElement);
    this.addSceneLights();
  }

  Model.prototype.introPreloading = function () {
    this.grid.showWhiteGrid();

    TweenLite.to(this.cam, 1, {
      distTarget: 30
    });

    TweenLite.to(this.cam.rotTarget, 1, {
      x: 0,
      y: 90
    });
  };
  
  Model.prototype.introPreloaded = function (_cargo) {
    this.car = new CarBody_1.default(this.scene, _cargo);
    this.skyRadiance = _cargo['envSkybox'];
    this.skyRadiance.format = THREE.RGBFormat;
    this.scene.background = this.skyRadiance;
  };

  Model.prototype.introStart = function () {
    this.grid.goToBlackGrid();

    TweenLite.to(this.cam.rotTarget, 1, {
      x: -20,
      y: 0
    });

    TweenLite.to(this.cam, 1, {
      distTarget: 10,
      distActual: 10
    });

    TweenLite.to(this.spotLight, 3, {
      intensity: 1
    });

    TweenLite.to(this.props, 3, {
      speed: 12
    });
  };

  Model.prototype.addSceneLights = function () {
    this.ambLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
    this.spotLight = new THREE.DirectionalLight(0xFFFFFF, 0);
    
    this.spotLight.position.set(0, 2, 0);

    this.scene.add(this.spotLight);
    this.scene.add(this.ambLight);
  };
  
  Model.prototype.toggleStereo = function (_stereo, _orbit) {
    if (_stereo) {
      if (typeof this.binocs === 'undefined') {
        this.binocs = new binocs_1.default(this.camOptions);
        this.binocs.distTarget = 10;
      }

      this.cam = this.binocs;
      this.scene.add(this.binocs.binoculars);
      
      this.renderer.setScissorTest(true);
      this.renderer.setPixelRatio(window.devicePixelRatio >= 2 ? 2 : 1);
      
      if (_orbit === false) {
        this.binocs.setRotation(Utils.mod(this.monoc.rotActual.x, 360), this.monoc.rotActual.y, 0);
        this.binocs.rotTarget.x = 180 - Math.atan2(this.props.velocity.x, this.props.velocity.y) * (180 / Math.PI);
        this.binocs.rotTarget.y = 10;
      }
    } else {
      this.cam = this.monoc;
      this.scene.remove(this.binocs.binoculars);

      this.renderer.setViewport(0, 0, this.vpW, this.vpH);
      this.renderer.setScissorTest(false);
      this.renderer.setPixelRatio(1);
    }
    
    this.grid.onWindowResize(this.vpW, this.vpH, this.renderer.getPixelRatio());
    this.cam.onDeviceReorientation(this.deviceAngle);

    this.onWindowResize();
  };

  Model.prototype.onWindowResize = function () {
    this.vpW = this.pageMain.clientWidth;
    this.vpH = this.pageMain.clientHeight;

    this.grid.onWindowResize(this.vpW, this.vpH, this.renderer.getPixelRatio());
    this.car.onWindowResize(this.vpH);
    this.renderer.setSize(this.vpW, this.vpH);
    this.monoc.onWindowResize(this.vpW, this.vpH);

    if (typeof this.binocs !== 'undefined') {
      this.binocs.onWindowResize(this.vpW, this.vpH);
    }
  };

  Model.prototype.updateIntro = function (time) {
    this.renderer.clear();
    this.grid.update();
    this.cam.update();
    this.renderer.render(this.scene, this.monoc.camera);
  };

  Model.prototype.update = function (time, _stereo) {
    if (this.props.update(time) === false) {
      return;
    }

    this.renderer.clear();

    this.car.update(this.props);
    this.grid.update(this.props);
    
    this.camTarget.copy(this.car.carChassis.getWorldPosition());
    
    this.cam.setFocusPos(this.camTarget.x, 1, this.camTarget.z);
    this.cam.update();

    if (_stereo) {
      this.spotLight.position.copy(this.binocs.binoculars.position).normalize();
      this.spotLight.position.y = 1;
      this.binocs.renderStereo(this.renderer, this.scene);
    } else {
      this.spotLight.position.copy(this.monoc.camera.position).normalize();
      this.spotLight.position.y = 1;
      this.renderer.render(this.scene, this.monoc.camera, null, false);
    }
  };

  return Model;
}();

exports.default = Model;