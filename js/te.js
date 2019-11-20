'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function normalize(val, min, max) {
    return Math.max(0, Math.min(1, (val - min) / (max - min)));
}
exports.normalize = normalize;

function normalizeQuadIn(val, min, max) {
    return Math.pow(normalize(val, min, max), 2);
}
exports.normalizeQuadIn = normalizeQuadIn;

function normalizeQuadOut(val, min, max) {
    var x = normalize(val, min, max);
    return x * (2 - x);
}
exports.normalizeQuadOut = normalizeQuadOut;

function zTween(_val, _target, _ratio) {
    return _val + (_target - _val) * Math.min(_ratio, 1);
}
exports.zTween = zTween;

var Time = function () {
    function Time(timeFactor) {
        this.fallBackRates = [
            60,
            40,
            30,
            20,
            15
        ];
        this.prev = 0;
        this.prevBreak = 0;
        this.delta = 0;
        this.timeFact = typeof timeFactor === 'undefined' ? 1 : timeFactor;
        this.frameCount = 0;
        this.fallBackIndex = 0;
        this.setFPS(60);
    }
    Time.prototype.update = function (_newTime) {
        this.deltaBreak = Math.min(_newTime - this.prevBreak, 1);
        if (this.deltaBreak > this.spf) {
            this.delta = Math.min(_newTime - this.prev, 1);
            this.prev = _newTime;
            this.prevBreak = _newTime - this.deltaBreak % this.spf;
            return true;
        } else {
            return false;
        }
    };
    Time.prototype.checkFPS = function () {
        if (this.delta > this.spf * 2) {
            this.frameCount++;
            console.log(this.frameCount);
            if (this.frameCount > 30) {
                this.frameCount = 0;
                this.fallBackIndex++;
                this.setFPS(this.fallBackRates[this.fallBackIndex]);
            }
        }
    };
    Time.prototype.setFPS = function (_newVal) {
        this.fps = _newVal;
        this.spf = 1 / this.fps;
    };
    return Time;
}();
exports.Time = Time;

function shuffle(array) {
    var m = array.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
exports.shuffle = shuffle;

function mod(n, m) {
    return (n % m + m) % m;
}
exports.mod = mod;