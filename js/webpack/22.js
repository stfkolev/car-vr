'use strict';
var CarWheels_1 = require('./24');
var CarLights_1 = require('./23');
var CarBody = function () {
  function CarBody(_scene, _cargo) {
    this.parent = _scene;
    this.carWhole = new THREE.Group();
    this.carWhole.rotateY(-Math.PI / 2);
    this.parent.add(this.carWhole);
    this.carChassis = this.buildCarChassis(_cargo['vrBodyCompiled'], _cargo['envReflection']);
    this.carWhole.add(this.carChassis);
    this.addShadow(_cargo['shadow']);
    this.carLights = new CarLights_1.default(this.carChassis, _cargo);
    this.carWheels = new CarWheels_1.default(this.carWhole, _cargo);
  }
  CarBody.prototype.buildCarChassis = function (_bodyGeom, _cubeText) {
    _bodyGeom.scale.set(0.0005, 0.0005, 0.0005);
    _bodyGeom.position.set(1.56, 0, 0);
    this.envCube = _cubeText;
    this.envCube.format = THREE.RGBFormat;
    this.matBodySilver = new THREE.MeshStandardMaterial({
      color: 12303291,
      metalness: 0.7,
      roughness: 0.7,
      envMap: this.envCube
    });
    if (window['EXT_STLOD_SUPPORT'] === false) {
      this.envCube.minFilter = THREE.LinearFilter;
      this.matBodySilver.metalness = 0.05;
      this.matBodySilver.roughness = 0.8;
      this.matBodySilver.color = new THREE.Color(7829367);
    }
    this.matBodyBlack = new THREE.MeshLambertMaterial({
      color: 0,
      emissive: 4473924,
      reflectivity: 0.8,
      envMap: this.envCube
    });
    this.matGlassTinted = new THREE.MeshLambertMaterial({
      color: 0,
      emissive: 6710886,
      reflectivity: 1,
      envMap: this.envCube
    });
    this.matUndercarriage = new THREE.MeshBasicMaterial({ color: 0 });
    this.matGlassTransp = new THREE.MeshLambertMaterial({
      color: 0,
      emissive: 6710886,
      reflectivity: 1,
      envMap: this.envCube,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    _bodyGeom.getObjectByName('BodyBlack').material = this.matBodyBlack;
    _bodyGeom.getObjectByName('BodySilver').material = this.matBodySilver;
    _bodyGeom.getObjectByName('GlassTransparent').material = this.matGlassTransp;
    _bodyGeom.getObjectByName('GlassTinted').material = this.matGlassTinted;
    _bodyGeom.getObjectByName('Undercarriage').material = this.matUndercarriage;
    return _bodyGeom;
  };
  CarBody.prototype.addShadow = function (_shad) {
    var shadowPlane = new THREE.PlaneBufferGeometry(6.5, 6.5, 1, 1);
    shadowPlane.rotateX(-Math.PI / 2);
    shadowPlane.translate(1.56, 0, 0);
    var shadowMat = new THREE.MeshBasicMaterial({
      map: _shad,
      side: THREE.DoubleSide,
      blending: THREE.MultiplyBlending,
      transparent: true,
      depthWrite: false
    });
    var shadowMesh = new THREE.Mesh(shadowPlane, shadowMat);
    this.carWhole.add(shadowMesh);
  };
  CarBody.prototype.onWindowResize = function (_vpH) {
    this.carLights.onWindowResize(_vpH);
  };
  CarBody.prototype.update = function (_props) {
    this.carWhole.rotation.y = _props.theta;
    this.carChassis.rotation.z = _props.longitMomentum * 0.0015;
    this.carChassis.rotation.x = _props.lateralMomentum * 0.002;
    this.carWheels.update(_props);
    this.carLights.update(_props);
  };
  return CarBody;
}();
exports.default = CarBody;