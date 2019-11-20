'use strict';
var CarProps_1 = require('./1');
var utils_1 = require('./0');
var CarWheels = function () {
  function CarWheels(_carWhole, _cargo) {
    this.maxWheelTurn = Math.PI / 9.69;
    this.parent = _carWhole;
    this.thread = _cargo['thread'];
    this.thread.minFilter = THREE.NearestFilter;
    this.thread.magFilter = THREE.LinearFilter;
    this.thread.format = THREE.RGBFormat;
    this.ogMatrix = new THREE.Matrix4().set(0.000788, 0, 0, -0.3939, 0, 0, 0.000788, -0.3939, 0, -0.000788, 0, 0.15, 0, 0, 0, 1);
    this.invMatrix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1);
    this.wPosF = CarProps_1.Automotive.WheelBase;
    this.wPosB = 0;
    this.wPosL = CarProps_1.Automotive.WheelTrack / -2;
    this.wPosR = CarProps_1.Automotive.WheelTrack / 2;
    this.wPosY = CarProps_1.Automotive.WheelDiam / 2;
    var wheelGeom = _cargo['vrWheelBrakes'];
    this.addLeftWheels(wheelGeom.getObjectByName('Wheel'));
    this.addRightWheels();
    this.addBrakes(wheelGeom.getObjectByName('Brake'));
  }
  CarWheels.prototype.addLeftWheels = function (_wheelGroup) {
    this.wheelFL = _wheelGroup;
    this.meshRubber = this.wheelFL.getObjectByName('Tire');
    this.meshSilver = this.wheelFL.getObjectByName('RimsSilver');
    this.meshBlack = this.wheelFL.getObjectByName('RimsBlack');
    this.geomRubber = this.meshRubber.geometry;
    this.geomSilver = this.meshSilver.geometry;
    this.geomBlack = this.meshBlack.geometry;
    this.geomRubber.applyMatrix(this.ogMatrix);
    this.geomSilver.applyMatrix(this.ogMatrix);
    this.geomBlack.applyMatrix(this.ogMatrix);
    this.geomRubber.computeVertexNormals();
    this.geomSilver.computeVertexNormals();
    this.geomBlack.computeVertexNormals();
    this.matRubber = new THREE.MeshLambertMaterial({
      color: 2105376,
      map: this.thread
    });
    this.matSilver = new THREE.MeshPhongMaterial({
      color: 10066329,
      shininess: 50
    });
    this.matBlack = new THREE.MeshPhongMaterial({
      color: 1118481,
      shininess: 50
    });
    this.meshRubber.material = this.matRubber;
    this.meshSilver.material = this.matSilver;
    this.meshBlack.material = this.matBlack;
    this.wheelFL.position.set(this.wPosF, this.wPosY, this.wPosL);
    this.parent.add(this.wheelFL);
    this.wheelBL = this.wheelFL.clone();
    this.wheelBL.position.set(this.wPosB, this.wPosY, this.wPosL);
    this.parent.add(this.wheelBL);
  };
  CarWheels.prototype.addRightWheels = function () {
    this.iGeomRubber = this.geomRubber.clone();
    this.iGeomSilver = this.geomSilver.clone();
    this.iGeomBlack = this.geomBlack.clone();
    this.iGeomRubber.applyMatrix(this.invMatrix);
    this.iGeomSilver.applyMatrix(this.invMatrix);
    this.iGeomBlack.applyMatrix(this.invMatrix);
    this.iGeomRubber.computeVertexNormals();
    this.iGeomSilver.computeVertexNormals();
    this.iGeomBlack.computeVertexNormals();
    var iMatRubber = this.matRubber.clone();
    var iMatSilver = this.matSilver.clone();
    var iMatBlack = this.matBlack.clone();
    iMatRubber.side = THREE.BackSide;
    iMatSilver.side = THREE.BackSide;
    iMatBlack.side = THREE.BackSide;
    this.iMeshRubber = new THREE.Mesh(this.iGeomRubber, iMatRubber);
    this.iMeshSilver = new THREE.Mesh(this.iGeomSilver, iMatSilver);
    this.iMeshBlack = new THREE.Mesh(this.iGeomBlack, iMatBlack);
    this.wheelFR = new THREE.Group();
    this.wheelFR.add(this.iMeshRubber);
    this.wheelFR.add(this.iMeshSilver);
    this.wheelFR.add(this.iMeshBlack);
    this.wheelFR.position.set(this.wPosF, this.wPosY, this.wPosR);
    this.parent.add(this.wheelFR);
    this.wheelBR = this.wheelFR.clone();
    this.wheelBR.position.set(this.wPosB, this.wPosY, this.wPosR);
    this.parent.add(this.wheelBR);
  };
  CarWheels.prototype.addBrakes = function (_brakeGroup) {
    this.brakeBL = _brakeGroup;
    this.brMeshDisc = this.brakeBL.getObjectByName('Disc');
    this.brMeshPads = this.brakeBL.getObjectByName('Pad');
    this.brGeomDisc = this.brMeshDisc.geometry;
    this.brGeomPads = this.brMeshPads.geometry;
    this.brGeomDisc.applyMatrix(this.ogMatrix);
    this.brGeomPads.applyMatrix(this.ogMatrix);
    this.brGeomDisc.computeVertexNormals();
    this.brGeomPads.computeVertexNormals();
    this.brMatDisc = new THREE.MeshPhongMaterial({
      color: 5592405,
      shininess: 100,
      shading: THREE.FlatShading
    });
    this.brMatPads = new THREE.MeshPhongMaterial({
      color: 3355443,
      shininess: 50,
      shading: THREE.FlatShading
    });
    this.brMeshDisc.material = this.brMatDisc;
    this.brMeshPads.material = this.brMatPads;
    this.brakeBL.position.set(this.wPosB, this.wPosY, this.wPosL);
    this.parent.add(this.brakeBL);
    this.brakeFL = this.brakeBL.clone();
    this.brakeFL.position.set(this.wPosF, this.wPosY, this.wPosL);
    this.brakeFL.rotation.set(0, 0, Math.PI);
    this.parent.add(this.brakeFL);
    this.brakeFR = this.brakeBL.clone();
    this.brakeFR.position.set(this.wPosF, this.wPosY, this.wPosR);
    this.brakeFR.rotation.set(Math.PI, 0, Math.PI);
    this.parent.add(this.brakeFR);
    this.brakeBR = this.brakeBL.clone();
    this.brakeBR.position.set(this.wPosB, this.wPosY, this.wPosR);
    this.brakeBR.rotation.set(Math.PI, 0, 0);
    this.parent.add(this.brakeBR);
  };
  CarWheels.prototype.addHub = function (xPos, yPos, zPos) {
    var geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.03, 20);
    geometry.rotateX(Math.PI / 2);
    var material = new THREE.MeshPhongMaterial({
      color: 3355443,
      shininess: 50
    });
    var hubSphere = new THREE.Mesh(geometry, material);
    hubSphere.position.set(xPos, yPos, zPos);
    this.parent.add(hubSphere);
    return hubSphere;
  };
  CarWheels.prototype.turnByRadiusRatio = function (_props) {
    this.rotOverall = -_props.frameDist / CarProps_1.Automotive.WheelCirc * Math.PI * 2;
    this.rotFL = this.rotBL = this.rotFR = this.rotBR = Math.max(this.rotOverall, -this.maxWheelTurn);
    if (_props.wAngleSign !== 0) {
      this.ratioFO = _props.radFrontOut / _props.radBackIn;
      this.ratioBO = _props.radBackOut / _props.radBackIn;
      this.ratioFI = _props.radFrontIn / _props.radBackIn;
      this.ratioBI = 1;
      if (_props.wAngleSign == 1) {
        this.rotFL *= this.ratioFI;
        this.rotBL *= this.ratioBI;
        this.rotFR *= this.ratioFO;
        this.rotBR *= this.ratioBO;
        this.wheelFL.rotation.y = _props.wAngleInner;
        this.wheelFR.rotation.y = _props.wAngleOuter;
        this.brakeFL.rotation.y = _props.wAngleInner;
        this.brakeFR.rotation.y = -_props.wAngleOuter;
      } else {
        this.rotFL *= this.ratioFO;
        this.rotBL *= this.ratioBO;
        this.rotFR *= this.ratioFI;
        this.rotBR *= this.ratioBI;
        this.wheelFL.rotation.y = _props.wAngleOuter;
        this.wheelFR.rotation.y = _props.wAngleInner;
        this.brakeFL.rotation.y = _props.wAngleOuter;
        this.brakeFR.rotation.y = -_props.wAngleInner;
      }
      this.brakeBL.rotation.y = this.wheelBR.rotation.y = this.wheelBL.rotation.y = utils_1.normalize(_props.speed, 22.2, 0) * _props.wAngleInner * -0.09;
      this.brakeBR.rotation.y = -this.wheelBL.rotation.y;
    }
    this.wheelFL.rotateZ(this.rotFL);
    this.wheelBL.rotateZ(this.rotBL);
    this.wheelFR.rotateZ(this.rotFR);
    this.wheelBR.rotateZ(this.rotBR);
  };
  CarWheels.prototype.update = function (props) {
    this.turnByRadiusRatio(props);
  };
  return CarWheels;
}();
exports.default = CarWheels;