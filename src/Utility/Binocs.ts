'use strict';
var Binocs = function () {
  function Binocs(options) {
    this.options = {
      distance: 90,
      focusPos: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      distRange: {
        max: Number.POSITIVE_INFINITY,
        min: Number.NEGATIVE_INFINITY
      },
      fov: 45,
      eyeSeparation: 1.5
    };
    for (var key in options) {
      if (key === 'distRange') {
        for (var key in options.distRange) {
          this.options.distRange[key] = options.distRange[key];
        }
      } else {
        this.options[key] = options[key];
      }
    }
    this.distActual = this.options.distance;
    this.distTarget = this.options.distance;
    this.focusActual = this.options.focusPos.clone();
    this.focusTarget = this.options.focusPos.clone();
    this.rotActual = this.options.rotation.clone();
    this.rotTarget = this.options.rotation.clone();
    this.vpW = window.innerWidth;
    this.vpH = window.innerHeight;
    this.binoculars = new THREE.Object3D();
    this.lensL = new THREE.PerspectiveCamera(this.options.fov, this.vpW / 2 / this.vpH, 0.1, 100);
    this.lensR = new THREE.PerspectiveCamera(this.options.fov, this.vpW / 2 / this.vpH, 0.1, 100);
    this.lensL.position.setX(-this.options.eyeSeparation / 2);
    this.lensR.position.setX(this.options.eyeSeparation / 2);
    this.binoculars.add(this.lensL);
    this.binoculars.add(this.lensR);
    this.radians = Math.PI / 180;
    this.quatX = new THREE.Quaternion();
    this.quatY = new THREE.Quaternion();
    this.gyro = { orient: 0 };
    if (typeof window.orientation !== 'undefined') {
      this.defaultEuler = new THREE.Euler(90 * this.radians, 180 * this.radians, (180 + parseInt(window.orientation.toString(), 10)) * this.radians);
    } else {
      this.defaultEuler = new THREE.Euler(0, 0, 0);
    }
    this.addVignette();
  }

  Binocs.prototype.addVignette = function () {
    var outer = 0.05;
    var edge = outer * 0.8;
    var corner = outer * 0.75;
    var shape = new THREE.Shape();
    shape.moveTo(-outer, -outer);
    shape.lineTo(outer, -outer);
    shape.lineTo(outer, outer);
    shape.lineTo(-outer, outer);
    shape.closePath();
    var hole = new THREE.Path();
    hole.moveTo(-corner, -corner);
    hole.bezierCurveTo(-edge, 0, -edge, 0, -corner, corner);
    hole.bezierCurveTo(0, edge, 0, edge, corner, corner);
    hole.bezierCurveTo(edge, 0, edge, 0, corner, -corner);
    hole.bezierCurveTo(0, -edge, 0, -edge, -corner, -corner);
    shape.holes.push(hole);
    this.vigGeom = new THREE.ShapeGeometry(shape, 6);
    this.vigMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    this.vignetteL = new THREE.Mesh(this.vigGeom, this.vigMat);
    this.vignetteR = this.vignetteL.clone();
    this.vignetteL.position.set(-this.options.eyeSeparation / 2, 0, -0.11);
    this.vignetteR.position.set(this.options.eyeSeparation / 2, 0, -0.11);
    this.vignetteL.scale.set(this.vpW / 2 / this.vpH, 1, 1);
    this.vignetteR.scale.set(this.vpW / 2 / this.vpH, 1, 1);
    this.binoculars.add(this.vignetteL);
    this.binoculars.add(this.vignetteR);
  };
  
  Binocs.prototype.setDistance = function (dist) {
    if (dist === void 0) {
      dist = 150;
    }
    this.distActual = dist;
    this.distTarget = dist;
  };

  Binocs.prototype.setRotation = function (_rotX, _rotY, _rotZ) {
    if (_rotX === void 0) {
      _rotX = 0;
    }
    if (_rotY === void 0) {
      _rotY = 0;
    }
    if (_rotZ === void 0) {
      _rotZ = 0;
    }
    this.rotActual.set(_rotX, _rotY, _rotZ);
    this.rotTarget.set(_rotX, _rotY, _rotZ);
    this.gyro.alpha = undefined;
    this.gyro.beta = undefined;
    this.gyro.gamma = undefined;
  };

  Binocs.prototype.setFocusPos = function (_posX, _posY, _posZ) {
    if (_posX === void 0) {
      _posX = 0;
    }
    if (_posY === void 0) {
      _posY = 0;
    }
    if (_posZ === void 0) {
      _posZ = 0;
    }
    this.focusActual.set(_posX, _posY, _posZ);
    this.focusTarget.set(_posX, _posY, _posZ);
  };

  Binocs.prototype.dolly = function (distance) {
    this.distTarget += distance / 100;
    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
  };

  Binocs.prototype.orbitBy = function (angleX, angleY) {
    this.rotTarget.x += angleX;
    this.rotTarget.y += angleY;
  };

  Binocs.prototype.orbitTo = function (angleX, angleY) {
    this.rotTarget.x = angleX;
    this.rotTarget.y = angleY;
  };

  Binocs.prototype.pan = function (distX, distY) {
    this.focusTarget.x -= distX / 10;
    this.focusTarget.y += distY / 10;
  };

  Binocs.prototype.onWindowResize = function (vpW, vpH) {
    this.vpW = vpW;
    this.vpH = vpH;
    this.lensL.aspect = this.vpW / 2 / this.vpH;
    this.lensL.updateProjectionMatrix();
    this.lensR.aspect = this.vpW / 2 / this.vpH;
    this.lensR.updateProjectionMatrix();
    this.vignetteL.scale.set(this.vpW / 2 / this.vpH, 1, 1);
    this.vignetteR.scale.set(this.vpW / 2 / this.vpH, 1, 1);
  };
  
  Binocs.prototype.onDeviceReorientation = function (orientation) {
    this.gyro.orient = orientation * this.radians;
  };

  Binocs.prototype.onGyroMove = function (alpha, beta, gamma) {
    var acc = this.gyro;
    acc.alpha = alpha;
    acc.beta = beta;
    acc.gamma = gamma;
  };

  Binocs.prototype.update = function () {
    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
    this.distActual += (this.distTarget - this.distActual) * 0.01;
    this.focusActual.lerp(this.focusTarget, 0.05);
    this.binoculars.position.copy(this.focusActual);

    if (this.gyro.alpha && this.gyro.beta && this.gyro.gamma) {
      this.binoculars.setRotationFromEuler(this.defaultEuler);
      this.binoculars.rotateZ(this.gyro.alpha * this.radians);
      this.binoculars.rotateX(this.gyro.beta * this.radians);
      this.binoculars.rotateY(this.gyro.gamma * this.radians);
      this.binoculars.rotation.z += this.gyro.orient;
    } else {
      this.rotActual.lerp(this.rotTarget, 0.05);
      this.quatX.setFromAxisAngle(Binocs.axisX, -THREE.Math.degToRad(this.rotActual.y));
      this.quatY.setFromAxisAngle(Binocs.axisY, -THREE.Math.degToRad(this.rotActual.x));
      this.quatY.multiply(this.quatX);
      this.binoculars.quaternion.copy(this.quatY);
    }
    
    this.binoculars.translateZ(this.distActual);
  };

  Binocs.prototype.renderStereo = function (renderer, scene) {
    renderer.setScissor(0, 0, this.vpW / 2, this.vpH);
    renderer.setViewport(0, 0, this.vpW / 2, this.vpH);
    renderer.render(scene, this.lensL);
    renderer.setScissor(this.vpW / 2, 0, this.vpW / 2, this.vpH);
    renderer.setViewport(this.vpW / 2, 0, this.vpW / 2, this.vpH);
    renderer.render(scene, this.lensR);
  };

  Binocs.axisX = new THREE.Vector3(1, 0, 0);
  Binocs.axisY = new THREE.Vector3(0, 1, 0);

  return Binocs;
}();

exports.default = Binocs;