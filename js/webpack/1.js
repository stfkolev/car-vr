'use strict';
var utils_1 = require('./0');
var Automotive = function () {
  function Automotive() {
  }
  Automotive.Accel = 5;
  Automotive.Decel = -10;
  Automotive.MaxVel = 70 * 1610 / 3600;
  Automotive.MaxTurn = Math.PI * 0.33;
  Automotive.Length = 5.25;
  Automotive.Width = 2.283;
  Automotive.WheelTrack = 1.72;
  Automotive.WheelBase = 3.2;
  Automotive.WheelDiam = 0.78;
  Automotive.WheelCirc = Automotive.WheelDiam * Math.PI;
  return Automotive;
}();
exports.Automotive = Automotive;
var CarProps = function () {
  function CarProps() {
    this.time = new utils_1.Time();
    this.velocity = new THREE.Vector2();
    this.speed = 0;
    this.accel = 0;
    this.pos = new THREE.Vector2();
    this.joyVec = new THREE.Vector2();
    this.longitMomentum = 0;
    this.lateralMomentum = 0;
    this.wAngleInner = 0;
    this.wAngleOuter = 0;
    this.wAngleTarg = 0;
    this.keys = new Array();
    this.braking = 0;
    this.omega = 0;
    this.theta = -Math.PI / 2;
  }
  CarProps.prototype.onKeyDown = function (evt) {
    if (this.keys.indexOf(evt.keyCode) === -1) {
      this.keys.push(evt.keyCode);
      console.log(this.keys);
    }
  };
  CarProps.prototype.onKeyUp = function (evt) {
    this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
    console.log(this.keys);
  };
  CarProps.prototype.readKeyboardInput = function () {
    for (var i = 0; i < this.keys.length; i++) {
      switch (this.keys[i]) {
      case 38:
        this.accel += Automotive.Accel;
        this.accel *= utils_1.normalizeQuadIn(this.speed, Automotive.MaxVel, Automotive.MaxVel - 10);
        break;
      case 40:
        this.accel += Automotive.Decel;
        this.braking = 1;
        break;
      case 37:
        this.wAngleTarg += Automotive.MaxTurn;
        break;
      case 39:
        this.wAngleTarg -= Automotive.MaxTurn;
        break;
      case 80:
        isCarDecel = true;
        break;
      }
    }
  };
  CarProps.prototype.onJoystickMove = function (_vec) {
    this.joyVec.x = _vec.x / -40;
    this.joyVec.y = _vec.y / -40;
    if (Math.abs(this.joyVec.x) > 0.85) {
      this.joyVec.y = 0;
    }
    if (Math.abs(this.joyVec.y) > 0.95) {
      this.joyVec.x = 0;
    }
  };
  CarProps.prototype.readJoyStickInput = function () {
    this.wAngleTarg = this.joyVec.x * Automotive.MaxTurn;
    if (this.joyVec.y >= 0) {
      this.accel = this.joyVec.y * Automotive.Accel;
      this.accel *= utils_1.normalizeQuadIn(this.speed, Automotive.MaxVel, Automotive.MaxVel - 10);
      this.braking = 0;
    } else {
      this.accel = this.joyVec.y * -Automotive.Decel;
      this.braking = 1;
    }
  };
  CarProps.prototype.update = function (_time) {
    if (this.time.update(_time) === false) {
      return false;
    }
    this.accel = 0;
    this.braking = 0;
    this.wAngleTarg = 0;
    if (this.keys.length > 0) {
      this.readKeyboardInput();
    } else if (this.joyVec.x != 0 || this.joyVec.y != 0) {
      this.readJoyStickInput();
    } else if (this.keys.length == 0) {
      this.accel += Automotive.Decel + Math.PI * 0.5;
      console.log(this.accel);
    }
    this.accel *= this.time.delta;
    this.speed += this.accel;
    if (this.speed < 0) {
      this.speed = 0;
      this.accel = 0;
    }
    this.frameDist = this.speed * this.time.delta;
    this.wAngleTarg *= utils_1.normalizeQuadIn(this.speed, Automotive.MaxVel + 10, 3);
    this.wAngleInner = utils_1.zTween(this.wAngleInner, this.wAngleTarg, this.time.delta * 2);
    this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;
    this.omega = this.wAngleInner * this.speed / Automotive.WheelBase;
    this.theta += this.omega * this.time.delta;
    this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
    this.pos.add(this.velocity);
    this.longitMomentum = utils_1.zTween(this.longitMomentum, this.accel / this.time.delta, this.time.delta * 6);
    this.lateralMomentum = this.omega * this.speed;
    if (this.wAngleSign) {
      this.radFrontIn = Automotive.WheelBase / Math.sin(this.wAngleInner);
      this.radBackIn = Automotive.WheelBase / Math.tan(this.wAngleInner);
      this.radBackOut = this.radBackIn + Automotive.WheelTrack * this.wAngleSign;
      this.wAngleOuter = Math.atan(Automotive.WheelBase / this.radBackOut);
      this.radFrontOut = Automotive.WheelBase / Math.sin(this.wAngleOuter);
    } else {
      this.radFrontOut = 100;
      this.radBackOut = 100;
      this.radBackIn = 100;
      this.radFrontIn = 100;
      this.wAngleOuter = 0;
    }
    return true;
  };
  return CarProps;
}();
exports.CarProps = CarProps;