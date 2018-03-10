define([
    "tabcontrol-helper",
    "plugin-context",
    "actionqueue",
    "dialog",
    "ultilities",
    "views/framework/js/core/validate-helper"],
    function (TabControlHelper, PluginContext, ActionQueue, Dialog, Ultilities, ValidateHelper) {
        'use strict';

        var atomic = {};

        atomic.dialog = Dialog;
        atomic.tabs = TabControlHelper;
        atomic.ultis = Ultilities;
        atomic.validate = ValidateHelper;

        atomic.plugin = function (options) {
            return new PluginContext(options);
        }

        atomic.aq = function () {
            return new ActionQueue();
        }

        return atomic;
    });