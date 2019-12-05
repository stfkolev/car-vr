'use strict';
var Controls_1 = require('./Controls/Controls');
var control;

function noWebGL() {
  document.getElementById('preloader').className = 'visible';
  document.getElementById('preLogo').style.display = 'block';
  document.getElementById('preButton').style.display = 'block';
  document.getElementById('preDetail').innerHTML = translations['BROWSER_BAD'];
}

function initApp() {
  control = new Controls_1.default();
  render(0);
}

function render(t) {
  control.update(t * 0.001);
  requestAnimationFrame(render);
}

function browserCheck() {
  return !navigator.userAgent.match(/UCBrowser/);
}

function detectWebGL() {
  try {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    window['EXT_STLOD_SUPPORT'] = context.getExtension('EXT_shader_texture_lod') ? true : false;
    return !!(window.WebGLRenderingContext && context);
  } catch (e) {
    return false;
  }
}
if (detectWebGL() && browserCheck()) {
  initApp();
} else {
  noWebGL();
}