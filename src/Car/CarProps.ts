'use strict';

var utils_1 = require('../Utility/Utils');

var Automotive = function () {
  function Automotive() {}
  Automotive.Force = 1800;
  Automotive.Accel = 10;
  Automotive.Decel = -5;
  Automotive.MaxVel = 70 * 1610 / 3600;
  Automotive.MaxTurn = Math.PI * 0.33;
  Automotive.Length = 5.25;
  Automotive.Width = 2.283;
  Automotive.WheelTrack = 1.72;
  Automotive.WheelBase = 3.2;
  Automotive.WheelDiam = 0.78;
  Automotive.WheelCirc = Automotive.WheelDiam * Math.PI;
  Automotive.Weight = 3198;
  return Automotive;
}();

exports.Automotive = Automotive;

var CarProps = function () {
  function CarProps() {
    this.time = new utils_1.Time();
    this.velocity = new THREE.Vector2();
    this.speed = 0;
    this.accel = 0;
    this.gear = 1;
    this.pos = new THREE.Vector2();
    this.joyVec = new THREE.Vector2();

    // Momentum
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
    // Add key to list if they don't exist yet
    if (this.keys.indexOf(evt.keyCode) === -1)
      this.keys.push(evt.keyCode);
  };

  CarProps.prototype.onKeyUp = function (evt) {
    //Otherwise, remove from keys list
    this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
  };

  CarProps.prototype.readKeyboardInput = function () {
    for (var i = 0; i < this.keys.length; i++) {
      switch (this.keys[i]) {

        case 17: // CTRL - Shift Down
          if ((this.speed * 3.6) < 5.314815 && this.gear != -1) {
            this.gear = -1;
          } else {
            if (this.gear > 0)
              this.gear--;
          }
          break;

        case 16: // SHIFT - Shift Up
          if (this.gear == -1 && this.speed * 3.6 < 5.314815)
            this.gear++;
          if (this.gear > 0 && this.gear < 6)
            this.gear++;

          break;

        case 38: // Up
          if (this.gear > -1) {
            this.accel += Automotive.Accel;

            // Simulate wind resistance as we reach top speed
            this.accel *= utils_1.normalizeQuadIn(this.speed, Automotive.MaxVel, Automotive.MaxVel - 10);
          } else {
            this.accel += Automotive.Decel / 1.2;
            this.braking = 1;
          }

          break;

        case 40: // Down
          if (this.gear == -1) {
            this.accel += Automotive.Accel;
            this.accel *= utils_1.normalizeQuadIn(this.speed, Automotive.MaxVel / Math.PI, Automotive.MaxVel / Math.PI - 10);
          } else {
            this.accel += Automotive.Decel / 1.2;
            this.braking = 1;
          }

          break;

        case 32: // Space
          this.accel += Automotive.Decel;
          this.braking = 1;

          break;

        case 37: { // Left
          const omegaAxle = 0.6;
          const omegaMg = 0.4;

          /*!  
           *  Variables:
           *      F - Friction
           *      m - Weight
           *      g - acceleration
           *      R - Axle Force
           *      W - Number of Wheels
           *      F^fr^max - ~decceleration
           * 
           *  Constants:
           *      u^s = 0.6
           *      u^k = 0.4
           * 
           *  Formula:
           *      F = (((m / R) * g) * u^s * u^k) - 4) * F^fr^max
           *      
           */
          const decceleration = (Automotive.Weight / Automotive.Force * Automotive.Accel * omegaAxle * omegaMg - 4) * Automotive.Decel;
          
          this.accel += decceleration - Automotive.MaxTurn;

          this.wAngleTarg += Automotive.MaxTurn;

          break;
        }

        case 39: { // Right

          const omegaAxle = 0.6;
          const omegaMg = 0.4;
          const decceleration = (Automotive.Weight / Automotive.Force * Automotive.Accel * omegaAxle * omegaMg - 4) * Automotive.Decel;
          
          this.accel += decceleration - Automotive.MaxTurn;

          this.wAngleTarg -= Automotive.MaxTurn;

          break;
        }
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

    //Accelerating
    if (this.joyVec.y >= 0) {
      this.accel = this.joyVec.y * Automotive.Accel;

      // Simulate wind resistance as we reach top speed
      this.accel *= utils_1.normalizeQuadIn(this.speed, Automotive.MaxVel, Automotive.MaxVel - 10);
      
      this.braking = 0;
    } else {
      this.accel = this.joyVec.y * -Automotive.Decel;
     
      this.braking = 1;
    }
  };

  /////////////////////////////// UPDATE ///////////////////////////////
  CarProps.prototype.update = function (_time) {
    // Update time, skips according to FPS
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
      const omegaAxle = 0.6;
      const omegaMg = 0.4;
      
      const decceleration = (Automotive.Weight / Automotive.Force * Automotive.Accel * omegaAxle * omegaMg - 4) * Automotive.Decel;
      
      this.accel += decceleration;
    }

    this.accel *= this.time.delta;
    this.speed += this.accel;

    let speedometer = document.getElementsByClassName('speedometerSpeed');
    speedometer[0].innerHTML = Math.round(parseInt((this.speed * 3.6).toString())).toString();
    
    ///////////////// PHYSICS, YO! /////////////////
    if (this.speed < 0) {
      this.speed = 0;
      this.accel = 0;
    }

    this.frameDist = this.speed * this.time.delta;

    // Limit turn angle as speed increases
    this.wAngleTarg *= utils_1.normalizeQuadIn(this.speed, Automotive.MaxVel + 10, 3);
    this.wAngleInner = utils_1.zTween(this.wAngleInner, this.wAngleTarg, this.time.delta * 2);
    this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;

    // Theta is based on speed, wheelbase & wheel angle
    this.omega = this.wAngleInner * this.speed / Automotive.WheelBase;

    if(this.gear == -1) 
      this.theta -= this.omega * this.time.delta;
    else
      this.theta += this.omega * this.time.delta;

    if (this.gear > -1) {
      // Calc this frame's XY velocity
      this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
      
      // Add velocity to total position
      this.pos.add(this.velocity);
    } else {
      
      // Calc this frame's XY velocity
      this.velocity.set(-Math.cos(this.theta) * this.frameDist, Math.sin(this.theta) * this.frameDist);

      // Add velocity to total position
      this.pos.add(this.velocity);
    }

    // Fake some momentum
    this.longitMomentum = utils_1.zTween(this.longitMomentum, this.accel / this.time.delta, this.time.delta * 6);
    this.lateralMomentum = this.omega * this.speed;

    if (this.wAngleSign) {
        // Calculate 4 wheel turning radius if angle
        this.radFrontIn = Automotive.WheelBase / Math.sin(this.wAngleInner);
        this.radBackIn = Automotive.WheelBase / Math.tan(this.wAngleInner);
        this.radBackOut = this.radBackIn + Automotive.WheelTrack * this.wAngleSign;
        this.wAngleOuter = Math.atan(Automotive.WheelBase / this.radBackOut);
        this.radFrontOut = Automotive.WheelBase / Math.sin(this.wAngleOuter);
    } else {
      // Otherwise, just assign a very large radius.
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