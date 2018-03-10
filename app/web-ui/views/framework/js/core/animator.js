define(["tween"], function (TWEEN) {
    'use strict';


    var Animator = function (source) {

        this.source = source;
        this.sourceBackup = null;
        this.timeStart = null;
        this.duration = null;
        this.easingCallback = null;
        this.isBusy = false;
        this.onUpdateCallback = null;
    }

    Animator.prototype.easing = function (func) {

        this.easingCallback = func;

        return this;
    }

    Animator.prototype.onUpdate = function (func) {

        this.onUpdateCallback = func;

        return this;
    }

    Animator.prototype.to = function (target, duration) {



        this.isBusy = true;

        this.target = target;
        this.timeStart = new Date().getTime() - 13;
        this.duration = duration;

        this.sourceBackup = {};
        for (var key in this.target) {
            this.sourceBackup[key] = this.source[key];
        }

        this.update();
        return this;
    }

    Animator.prototype.update = function () {

        if (!this.isBusy)
            return;

        var now = new Date().getTime();
        var diff = now - this.timeStart;
        var rate = diff / this.duration;
        var completed = false;

        if (rate > 1) {
            rate = 1;
            completed = true;
        }

        rate = this.easingCallback(rate);

        var e = {};

        for (var key in this.target) {

            var from = this.sourceBackup[key];
            var d = this.target[key] - from;
            d *= rate;

            var current = this.source[key];
            var next = from + d;
            this.source[key] = next;

            e[key] = next - current;
        }

        this.onUpdateCallback(e);

        this.isBusy = !completed;

        return this;
    }


    return Animator;
});