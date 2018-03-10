define([], function () {
    'use strict';

    var ActionQueue = function () {

        this.queue = [];
        this.current = -1;
        this.isActivated = false;

        this.tryStart = function () {
            if (this.isActivated || this.queue.length == 0)
                return;

            this.isActivated = true;
            this.doAction(this.getNext());
        };

        this.getNext = function () {

            for (++this.current; this.current < this.queue.length; this.current++) {
                var action = this.queue[this.current];
                if (!action)
                    continue;

                return action;
            }

            this.queue = [];
            this.current = -1;
            this.isActivated = false;
            return null;
        }

        this.doAction = function (action) {
            if (!action)
                return;
            var _this = this;
            action(function () {
                _this.doAction(_this.getNext());
            });
        }
    }

    ActionQueue.prototype.do = function (action) {
        this.queue.push(action);
        this.tryStart();
    }

    ActionQueue.prototype.clear = function () {
        for (var i = this.current + 1; i < this.queue.length; i++)
            this.queue[i] = undefined;
    }

    return ActionQueue;
});