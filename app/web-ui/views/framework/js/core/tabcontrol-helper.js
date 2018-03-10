define(["jquery"], function ($) {
    'use strict';



    var applyTabControl = function (tabcontrol) {

        var lastIndex = -1;
        var lastPanel = null;
        var panels = $(tabcontrol).next().children("div.tab-pane");

        var selector = $("<div class='tab-selector'></div>");
        $(tabcontrol).append(selector);
        var activeItem = $(tabcontrol).children("li.active:eq(0)");

        var isTop = $(tabcontrol).hasClass("ctabs-top");
        if (isTop) {
            selector.width(activeItem.width());
            selector.offset({ left: activeItem.offset().left });
        }
        else {
            selector.height(activeItem.height());
            selector.offset({ top: activeItem.offset().top });
        }

        $(tabcontrol).find("a[data-toggle='tab']").each(function (index) {

            $(this).on("show.bs.tab", function (e) {

                if (lastIndex == index)
                    return;

                var length = index > lastIndex ? $(panels).width() - 100 : -$(panels).width() + 100;

                var panel = $(panels.eq(index));
                panel.stop();
                panel.offset({ left: length });
                panel.css({ opacity: .0 });
                panel.animate({ left: "0px", opacity: 1 }, 500, "easeInOutExpo");

                if (isTop) {
                    selector.width($(this).parent().width());
                    selector.offset({ left: $(this).parent().offset().left });
                }
                else {
                    selector.height($(this).parent().height());
                    selector.offset({ top: $(this).parent().offset().top });
                }
                if (lastPanel) {
                    lastPanel.stop();
                    lastPanel.addClass("ctab-in");
                    lastPanel.animate({ left: -length + "px", opacity: 0 }, 500, "easeInOutExpo", function () {
                        $(this).removeClass("ctab-in");
                    });
                }

                lastIndex = index;
                lastPanel = panel;
            });
        });
    };

    var obj = {};
    obj.apply = function (dom) {
        dom.find(".ctabs").each(function () {
            applyTabControl(this);
        });
    };

    (function () {

        var defaults = {};

        $.fn.extend({
            "tabcontrol": function (options) {
                var opts = $.extend({}, defaults, options);

                this.each(function () {
                    applyTabControl(this);
                });
            }
        });
    })();

    return obj;
});