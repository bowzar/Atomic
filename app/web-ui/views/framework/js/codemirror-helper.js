define([
    "views/global/js/codemirror/lib/codemirror",
    "views/global/js/codemirror/lib/addons/autorefresh",
    "views/global/js/codemirror/mode/htmlmixed/htmlmixed",
    "views/global/js/codemirror/mode/javascript/javascript",
    "views/global/js/codemirror/mode/css/css"],
    function (CodeMirror) {
        'use strict';

        var helper = {};

        helper.fromTextArea = function (domID, mode, options) {

            options = options || {};
            
            var editor = CodeMirror.fromTextArea(document.getElementById(domID), {
                mode: mode,
                lineNumbers: options.lineNumbers || true,
                matchBrackets: options.matchBrackets || true,
                scrollbarStyle: options.scrollbarStyle || null,
                autoRefresh: options.autoRefresh || true,
                indentUnit: options.indentUnit || 4,
                readOnly: options.readOnly || true,
            });

            editor.setSize("100%", "100%");
            return editor;
        };

        return helper;
    });