'use strict';
var headgridVS = require('../Shaders/HeadGridVS');
var headgridFS = require('../Shaders/headgridFS');
var tailLightVS = require('../Shaders/tailLightVS');
var tailGridVS = require('../Shaders/tailGridVS');
var tailGridFS = require('../Shaders/tailGridFS');
var flareVS = require('../Shaders/FlareVS');
var flareFS = require('../Shaders/FlareFS');
var turnBarVS = require('../Shaders/turnBarVS');
var reverseBarVS = require('../Shaders/reverseBarVS');
var reverseGridFS = require('../Shaders/ReverseGridFS');
var stopBarVS = require('../Shaders/stopBarVS');
var turnBarFS = require('../Shaders/turnBarFS');

var CarLights = function () {
  function CarLights(_carChassis, _cargo) {
    this.lfTimer = 0;
    this.rtTimer = 0;
    this.carChassis = _carChassis;
    this.flareHeadText = _cargo['flareHead'];
    this.flareTurnText = _cargo['flareTurn'];
    this.glowTurnText = _cargo['lightTurn'];
    this.glowStopText = _cargo['lightStop'];
    this.glowReverseText = _cargo['lightReverse'];
    this.uniLightsTurn = new THREE.Vector3(0, 0, 0);
    this.uniLightsOther = new THREE.Vector3(0, 1, 0);
    this.initLightMeshes();
    this.initHeadlightFlares();
    this.initStopFlares();
    this.initReverseFlares();
    this.initTurnFlares();
  }

  CarLights.prototype.initLightMeshes = function () {
    var tailGrid = this.carChassis.getObjectByName('TailGrid');

    tailGrid.geometry.computeVertexNormals();

    this.matHeadLights = new THREE.ShaderMaterial({
      uniforms: {
        lightsT: {
          value: this.uniLightsTurn
        },
        lightsO: {
          value: this.uniLightsOther
        }
      },
      vertexShader: headgridVS,
      fragmentShader: headgridFS
    });

    this.matTailLights = new THREE.ShaderMaterial({
      uniforms: {
        lightsT: {
          value: this.uniLightsTurn
        },
        lightsO: {
          value: this.uniLightsOther
        }
      },
      vertexShader: tailLightVS,
      fragmentShader: tailGridFS
    });

    this.matTailGrid = new THREE.ShaderMaterial({
      uniforms: {
        lightsT: {
          value: this.uniLightsTurn
        },
        lightsO: {
          value: this.uniLightsOther
        }
      },
      vertexShader: tailGridVS,
      fragmentShader: tailGridFS
    });

    this.carChassis.getObjectByName('HeadLights').material = this.matHeadLights;
    this.carChassis.getObjectByName('TailLights').material = this.matTailLights;
    tailGrid.material = this.matTailGrid;
  };

  CarLights.prototype.initHeadlightFlares = function () {
    this.flareHeadMat = new THREE.ShaderMaterial({
      uniforms: {
        texture: {
          value: this.flareHeadText
        },
        vpH: {
          value: window.innerHeight
        },
        size: {
          value: 1.5
        },
        brightness: {
          value: 1
        }
      },
      vertexShader: flareVS,
      fragmentShader: flareFS,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });

    var posArray = new Float32Array([
      4000,
      1875,
      1700,
      4300,
      1800,
      1700,
      4000,
      1875,
      -1700,
      4300,
      1800,
      -1700
    ]);

    var normArray = new Float32Array([
      0.87,
      0.22,
      0.44,
      0.87,
      0.22,
      0.44,
      0.87,
      0.22,
      -0.44,
      0.87,
      0.22,
      -0.44
    ]);

    this.flareHeadGeom = new THREE.BufferGeometry();
    this.flareHeadGeom.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
    this.flareHeadGeom.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
    this.flareHeadPoints = new THREE.Points(this.flareHeadGeom, this.flareHeadMat);
    this.carChassis.add(this.flareHeadPoints);
  };

  CarLights.prototype.initStopFlares = function () {
    var glowStopMat = new THREE.ShaderMaterial({
      uniforms: {
        texture: {
          value: this.glowStopText
        }
      },
      vertexShader: stopBarVS,
      fragmentShader: turnBarFS,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });

    this.glowStop = this.carChassis.getObjectByName('Stop');
    this.glowStop.material = glowStopMat;
  };

  CarLights.prototype.initReverseFlares = function () {
    var glowReverseMat = new THREE.ShaderMaterial({
      uniforms: {
        texture: {
          value: this.glowReverseText
        }
      },
      vertexShader: reverseBarVS,
      fragmentShader: reverseGridFS,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });

    this.glowReverse = this.carChassis.getObjectByName('Reverse');
    this.glowReverse.material = glowReverseMat;
  };

  CarLights.prototype.initTurnFlares = function () {
    var posArray = new Float32Array([
      -4755,
      2227,
      -1269,
      -4703,
      2222,
      -1326,
      -4649,
      2215,
      -1381,
      -4590,
      2208,
      -1436,
      -4526,
      2200,
      -1492,
      -4459,
      2192,
      -1548,
      -4386,
      2182,
      -1604,
      -4718,
      2182,
      -1264,
      -4668,
      2179,
      -1321,
      -4301,
      2175,
      -1658,
      -4614,
      2175,
      -1377,
      -4556,
      2168,
      -1433,
      -4494,
      2163,
      -1489,
      -4429,
      2158,
      -1545,
      -4358,
      2151,
      -1600,
      -4266,
      2147,
      -1653,
      -4675,
      2136,
      -1260,
      -4627,
      2134,
      -1316,
      -4575,
      2132,
      -1373,
      -4520,
      2130,
      -1428,
      -4461,
      2128,
      -1485,
      -4400,
      2126,
      -1540,
      -4329,
      2123,
      -1597
    ]);

    var normArray = new Float32Array([
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4
    ]);

    this.flareTurnMat = this.flareHeadMat.clone();
    this.flareTurnMat.uniforms['texture'].value = this.flareTurnText;
    this.flareTurnMat.uniforms['size'].value = 0.05;
    this.flareTurnMat.uniforms['brightness'].value = 1;

    var leftTurnGrid = new THREE.BufferGeometry();

    leftTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
    leftTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));

    this.flareLPoints = new THREE.Points(leftTurnGrid, this.flareTurnMat);
    this.carChassis.add(this.flareLPoints);

    posArray = new Float32Array([
      -4755,
      2227,
      1269,
      -4703,
      2222,
      1326,
      -4649,
      2215,
      1381,
      -4590,
      2208,
      1436,
      -4526,
      2200,
      1492,
      -4459,
      2192,
      1548,
      -4386,
      2182,
      1604,
      -4718,
      2182,
      1264,
      -4668,
      2179,
      1321,
      -4301,
      2175,
      1658,
      -4614,
      2175,
      1377,
      -4556,
      2168,
      1433,
      -4494,
      2163,
      1489,
      -4429,
      2158,
      1545,
      -4358,
      2151,
      1600,
      -4266,
      2147,
      1653,
      -4675,
      2136,
      1260,
      -4627,
      2134,
      1316,
      -4575,
      2132,
      1373,
      -4520,
      2130,
      1428,
      -4461,
      2128,
      1485,
      -4400,
      2126,
      1540,
      -4329,
      2123,
      1597
    ]);

    normArray = new Float32Array([
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4
    ]);

    var rightTurnGrid = new THREE.BufferGeometry();

    rightTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
    rightTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));

    this.flareRPoints = new THREE.Points(rightTurnGrid, this.flareTurnMat);
    this.carChassis.add(this.flareRPoints);

    this.glowTurnMat = new THREE.ShaderMaterial({
      uniforms: {
        texture: {
          value: this.glowTurnText
        },
        lightsT: {
          value: this.uniLightsTurn
        }
      },
      vertexShader: turnBarVS,
      fragmentShader: turnBarFS,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });

    this.carChassis.getObjectByName('Turn').material = this.glowTurnMat;
  };

  CarLights.prototype.onWindowResize = function (_vpH) {
    this.flareHeadMat.uniforms['vpH'].value = _vpH;
    this.flareTurnMat.uniforms['vpH'].value = _vpH;
  };

  CarLights.prototype.update = function (_props) {
    if (_props.wAngleTarg > 0) {
      this.lfTimer = (this.lfTimer + _props.time.delta * 2) % 2;
      this.uniLightsTurn.y = this.lfTimer > 1 ? 0 : 1;
      this.uniLightsTurn.z = 0;
      this.uniLightsTurn.x = -1;
    } else if (_props.wAngleTarg < 0) {
      this.rtTimer = (this.rtTimer + _props.time.delta * 2) % 2;
      this.uniLightsTurn.z = this.rtTimer > 1 ? 0 : 1;
      this.uniLightsTurn.y = 0;
      this.uniLightsTurn.x = 1;
    } else {
      this.lfTimer = 0;
      this.rtTimer = 0;
      this.uniLightsTurn.y = 0;
      this.uniLightsTurn.z = 0;
      this.uniLightsTurn.x = 0;
    }

    this.uniLightsOther.x = 0;
    this.glowStop.visible = _props.braking ? true : false;
    this.glowReverse.visible = _props.gear == -1 ? true : false;
    this.flareLPoints.visible = this.uniLightsTurn.y ? true : false;
    this.flareRPoints.visible = this.uniLightsTurn.z ? true : false;
  };

  return CarLights;
}();

exports.default = CarLights;