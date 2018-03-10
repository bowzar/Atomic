define(["jquery"], function ($) {
    'use strict';

    var PluginContext = function (opts) {

        if (typeof opts == "string")
            opts = { name: opts };

        this.metadata = opts;
        if (this.metadata.name && !this.metadata.isBackground) {
            this.metadata.dir = this.metadata.dir || this.metadata.name.toLowerCase().replace(" ", "-");
            this.metadata.pathhtml = this.metadata.pathhtml || "views/" + this.metadata.dir + "/html/index.html";
            this.metadata.pathjs = this.metadata.pathjs || "views/" + this.metadata.dir + "/js/index.js";
            this.metadata.pathmodule = this.metadata.pathmodule || "views/" + this.metadata.dir + "/js/index";
        }
        else if (this.metadata.pathhtml &&
            this.metadata.pathmodule != "" &&
            !this.metadata.pathmodule &&
            !this.metadata.isBackground) {
            this.metadata.pathmodule = this.metadata.pathhtml.replace("/html/", "/js/").replace(".html", "");
        }

        this.loadHtml = function () {

            var _this = this;
            return new Promise(function (resolve, reject) {

                if (_this.metadata.isBackground) {
                    resolve();
                    return;
                }

                $.get(_this.metadata.pathhtml).then(function (html) {
                    _this.dom = $(html);
                    resolve(_this.dom);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        this.loadHtmlTo = function (containerId) {

            var _this = this;
            return new Promise(function (resolve, reject) {

                if (_this.metadata.isBackground) {
                    resolve();
                    return;
                }

                $.get(_this.metadata.pathhtml).then(function (html) {
                    _this.dom = $("#" + containerId).html(html);
                    resolve(_this.dom);
                }, function (error) {
                    reject(error);
                });
            });
        }

        this.loadEntry = function (args) {
            var _this = this;
            return new Promise(function (resolve, reject) {

                if (!_this.metadata.pathmodule) {
                    resolve(null);
                    return;
                }

                require([_this.metadata.pathmodule], function (instance) {

                    _this.instance = instance;
                    if (instance) {
                        instance.context = _this;
                        instance.dom = _this.dom;
                        instance.metadata = _this.metadata;
                    }

                    if (instance && instance.startup) {
                        instance.startup(args, function (onShownCallback) {
                            resolve(instance);

                            if (onShownCallback) {
                                setTimeout(function () {
                                    onShownCallback();
                                }, 1);
                            }
                        });
                    }
                }, function (error) {
                    reject(error);

                });
            });
        }

        this.requireEntry = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {

                if (!_this.metadata.pathmodule) {
                    resolve(null);
                    return;
                }

                require([_this.metadata.pathmodule], function (instance) {
                    _this.instance = instance;
                    if (instance) {
                        instance.context = _this;
                        instance.dom = _this.dom;
                        instance.metadata = _this.metadata;
                    }
                    resolve(instance);
                }, function (error) {
                    reject(error);

                });
            });
        }

        this.loadTo = function (containerId, args) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.loadHtmlTo(containerId).then(function () {
                    _this.loadEntry(args).then(function () {
                        resolve(_this);
                    }).catch(function (error) {
                        reject(error);
                    });
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        this.dispose = function () {

            if (this.instance && this.instance.shutdown) {
                this.instance.shutdown();
            }

            if (this.instance) {
                this.instance.dom = null;
                this.instance.metadata = null;
                this.instance.context = null;
                this.instance = null;
            }

            require.undef(this.metadata.pathmodule);

            this.dom = null;
            this.metadata = null;
        }
    }

    return PluginContext;
});