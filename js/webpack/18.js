'use strict';
var CamControl = function () {
  function CamControl(options) {
    this.options = {
      fov: 45,
      distance: 90,
      distRange: {
        max: Number.POSITIVE_INFINITY,
        min: Number.NEGATIVE_INFINITY
      },
      focusPos: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      rotRange: {
        xMax: Number.POSITIVE_INFINITY,
        xMin: Number.NEGATIVE_INFINITY,
        yMax: 90,
        yMin: -90
      },
      eyeSeparation: 0
    };
    for (var key in options) {
      if (key === 'rotRange') {
        for (var key in options.rotRange) {
          this.options.rotRange[key] = options.rotRange[key];
        }
      } else if (key === 'distRange') {
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
    var vpW = window.innerWidth;
    var vpH = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(this.options.fov, vpW / vpH, 0.1, 100);
    this.radians = Math.PI / 180;
    this.quatX = new THREE.Quaternion();
    this.quatY = new THREE.Quaternion();
    this.gyro = { orient: 0 };
    if (typeof window.orientation !== 'undefined') {
      this.defaultEuler = new THREE.Euler(90 * this.radians, 180 * this.radians, (180 + parseInt(window.orientation.toString(), 10)) * this.radians);
    } else {
      this.defaultEuler = new THREE.Euler(0, 0, 0);
    }
  }
  CamControl.prototype.setDistance = function (dist) {
    if (dist === void 0) {
      dist = 150;
    }
    this.distActual = dist;
    this.distTarget = dist;
  };
  CamControl.prototype.setAngleRange = function (xMax, xMin, yMax, yMin) {
    if (xMax === void 0) {
      xMax = Number.POSITIVE_INFINITY;
    }
    if (xMin === void 0) {
      xMin = Number.NEGATIVE_INFINITY;
    }
    if (yMax === void 0) {
      yMax = 90;
    }
    if (yMin === void 0) {
      yMin = -90;
    }
    this.options.rotRange.xMax = xMax;
    this.options.rotRange.xMin = xMin;
    this.options.rotRange.yMax = yMax;
    this.options.rotRange.yMin = yMin;
  };
  CamControl.prototype.setRotation = function (_rotX, _rotY, _rotZ) {
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
  CamControl.prototype.setFocusPos = function (_posX, _posY, _posZ) {
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
  CamControl.prototype.dolly = function (distance) {
    this.distTarget += distance / 100;
    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
  };
  CamControl.prototype.orbitBy = function (angleX, angleY) {
    this.rotTarget.x += angleX;
    this.rotTarget.y += angleY;
    this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
    this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
  };
  CamControl.prototype.orbitTo = function (angleX, angleY) {
    this.rotTarget.x = angleX;
    this.rotTarget.y = angleY;
    this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
    this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
  };
  CamControl.prototype.pan = function (distX, distY) {
    this.focusTarget.x -= distX / 10;
    this.focusTarget.y += distY / 10;
  };
  CamControl.prototype.onWindowResize = function (vpW, vpH) {
    this.camera.aspect = vpW / vpH;
    this.camera.updateProjectionMatrix();
  };
  CamControl.prototype.onDeviceReorientation = function (orientation) {
    this.gyro.orient = orientation * this.radians;
  };
  CamControl.prototype.onGyroMove = function (alpha, beta, gamma) {
    var acc = this.gyro;
    acc.alpha = alpha;
    acc.beta = beta;
    acc.gamma = gamma;
  };
  CamControl.prototype.update = function () {
    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
    this.distActual += (this.distTarget - this.distActual) * 0.01;
    this.focusActual.lerp(this.focusTarget, 0.05);
    this.camera.position.copy(this.focusActual);
    if (this.gyro.alpha && this.gyro.beta && this.gyro.gamma) {
      this.camera.setRotationFromEuler(this.defaultEuler);
      this.camera.rotateZ(this.gyro.alpha * this.radians);
      this.camera.rotateX(this.gyro.beta * this.radians);
      this.camera.rotateY(this.gyro.gamma * this.radians);
      this.camera.rotation.z += this.gyro.orient;
    } else {
      this.rotActual.lerp(this.rotTarget, 0.05);
      this.quatX.setFromAxisAngle(CamControl.axisX, -THREE.Math.degToRad(this.rotActual.y));
      this.quatY.setFromAxisAngle(CamControl.axisY, -THREE.Math.degToRad(this.rotActual.x));
      this.quatY.multiply(this.quatX);
      this.camera.quaternion.copy(this.quatY);
    }
    this.camera.translateZ(this.distActual);
  };
  CamControl.prototype.follow = function (target) {
    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
    this.distActual += (this.distTarget - this.distActual) * 0.01;
    this.focusTarget.set(target.x, target.y + 1, target.z + this.distActual);
    this.focusActual.lerp(this.focusTarget, 0.01);
    this.camera.position.copy(this.focusActual);
    this.camera.lookAt(target);
  };
  CamControl.axisX = new THREE.Vector3(1, 0, 0);
  CamControl.axisY = new THREE.Vector3(0, 1, 0);
  return CamControl;
}();
exports.default = CamControl;