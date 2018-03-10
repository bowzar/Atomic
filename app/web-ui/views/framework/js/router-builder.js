define(["jquery", "actionqueue", "plugin-context"], function ($, ActionQueue, PluginContext) {
    'use strict';

    var PageLoader = (function () {
        function PageLoader() {

            this.queue = new ActionQueue();
        }

        PageLoader.prototype.installPage = function (parent, element, routes) {
            if ("canRoute" in element && !element.canRoute)
                return;

            element.status = {};
            element.props = element.props || {};
            element.parent = parent;
            element.nameInner = element.nameInner || element.name.toLowerCase().replace(/ /g, "-");

            if (!element.isBackground) {

                element.container = element.container || parent.childrenContainer || "body-main-container";
                element.dir = element.dir || (parent.dir ? parent.dir + "-" + element.nameInner : element.nameInner);
                element.pathhtml = element.pathhtml || "views/" + element.dir + "/html/index.html";
                element.pathjs = element.pathjs || element.pathhtml.replace("/html/", "/js/").replace(".html", ".js");
                element.pathmodule = element.pathmodule || element.pathhtml.replace("/html/", "/js/").replace(".html", "");
                element.pathcss = element.pathcss || element.pathhtml.replace("/html/", "/css/").replace(".html", ".css");
            }
            else {
                element.toString();
            }

            if (element.location)
                element.location = element.location;
            else if (parent.location)
                element.location = parent.location + "/" + element.nameInner;
            else
                element.location = "#/" + element.nameInner;

            var thisRoute = { on: this.createRouteHandler(element) };
            routes["/" + element.nameInner + (element.params ? "/" + element.params : "")] = thisRoute;

            if (!element.children)
                return;

            var _this = this;
            element.children.forEach(function (child) {
                _this.installPage(element, child, thisRoute);
            });
        };

        PageLoader.prototype.loadPage = function (element, callback) {

            var plugin = new PluginContext(element);
            element.context = plugin;
            plugin.loadHtmlTo(element.container).then(function (doc) {

                setTimeout(function () {
                    plugin.requireEntry().then(function (instance) {
                        element.instance = instance;

                        callback(doc, instance);

                    }).catch(function (error) {
                        callback(doc, undefined, error);
                    });
                }, 100);

            }).catch(function (error) {
                $("#" + element.container).html(error.responseText);
                callback(undefined, undefined, error);
            });
        };

        PageLoader.prototype.createRouteHandler = function (element) {

            var _this = this;
            var handler = function (...args) {

                _this.queue.clear();
                _this.queue.do(function (next) {

                    if (element.status.isLoaded && (element.props.backReload == undefined || element.props.backReload))
                        _this.unloadTravesal(element);

                    _this.loadTravesal(element, args, function () {
                        if (element.instance && element.instance.indicate)
                            element.instance.indicate(args);

                        next();
                    });
                });
            };

            return handler;
        };

        PageLoader.prototype.loadTravesal = function (element, args, callback) {
            var _this = this;
            if (!element ||
                !("name" in element) ||
                element.status.isLoaded) {

                if (element.children) {
                    element.children.forEach(function (child) {
                        _this.unloadTravesal(child);
                    });
                }

                callback();
                return;
            }

            this.loadTravesal(element.parent, args, function () {

                if (element.parent.status.before)
                    element.parent.status.before(element);

                element.status.isLoaded = true;
                element.parent.status.current = element;
                _this.loadPage(element, function (doc, instance, error) {

                    var completed = function (shown) {
                        if (element.parent.status.after)
                            element.parent.status.after(element);

                        setTimeout(function () {
                            if (shown)
                                shown();

                            if (instance && instance.onShown)
                                instance.onShown();
                        }, 1);

                        var container = $("#" + element.container);
                        container.css({ opacity: .0 });
                        container.animate({ opacity: 1 }, 500, "easeInOutExpo");

                        callback();
                    };

                    if (instance && instance.startup)
                        instance.startup(args, completed);
                    else
                        completed();
                });
            });
        }

        PageLoader.prototype.unloadTravesal = function (element) {

            if (!element)
                return;

            if (element.context) {
                element.context.dispose();
                element.context = null;
            }

            element.instance = null;
            element.status.isLoaded = false;
            element.status.current = null;

            if (!element.children)
                return;

            var _this = this;
            element.children.forEach(function (child) {
                _this.unloadTravesal(child);
            });
        }

        return PageLoader;
    })();

    return new PageLoader();
});
