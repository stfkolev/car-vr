'use strict';
var Gimbal = function () {
  function Gimbal() {
    this.RAD = Math.PI / 180;
    this.DEG = 180 / Math.PI;

    this.quaternion = new THREE.Quaternion();

    this.xVec = new THREE.Vector3(1, 0, 0);
    this.yVec = new THREE.Vector3(0, 1, 0);
    this.zVec = new THREE.Vector3(0, 0, 1);

    this.deviceAngle = 0;

    this.object = new THREE.Object3D();
    this.angles = new THREE.Euler();
    this.eulerOrigin = new THREE.Euler();

    if (typeof window.orientation !== 'undefined') {
      this.eulerOrigin.set(90 * this.RAD, 180 * this.RAD, (180 + parseInt(window.orientation.toString(), 10)) * this.RAD);
    }
  }

  Gimbal.prototype.onGyroMove = function (_a, _b, _g) {
    this.object.setRotationFromEuler(this.eulerOrigin);

    this.object.rotateZ(_a * this.RAD);
    this.object.rotateX(_b * this.RAD);
    this.object.rotateY(_g * this.RAD);

    this.object.rotation.z += this.deviceAngle;
    this.quaternion.copy(this.object.quaternion.inverse());

    this.yVec.set(0, 1, 0);
    this.yVec.applyQuaternion(this.quaternion);
    this.zVec.set(0, 0, 1);
    this.zVec.applyQuaternion(this.quaternion);

    this.heading = Math.atan2(this.zVec.x, this.zVec.z) * this.DEG;
    
    this.attack = Math.atan2(-this.yVec.z, this.yVec.y) * this.DEG;
    this.attack = Math.min(Math.max(this.attack, -90), 90);
    
    this.roll = Math.atan2(-this.yVec.x, this.yVec.y) * this.DEG;
  };

  Gimbal.prototype.onDeviceReorientation = function (_orientation) {
    this.deviceAngle = _orientation * this.RAD;
  };

  return Gimbal;
}();

exports.default = Gimbal;