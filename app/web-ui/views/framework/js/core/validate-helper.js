define([], function () {
    'use strict';

    var obj = {};
    obj.init = function (dom, options, args) {

        options.errorElement = options.errorElement || 'span';

        options.errorPlacement = options.errorPlacement || function (error, element) {

            var parent = element.closest('.form-group');
            parent.find(".glyphicon.error.icon").remove();

            var icon = $('<span data-toggle="tooltip" data-placement="right" class="glyphicon glyphicon-exclamation-sign error icon"></span>');
            icon.attr("title", error.text());
            error.data("icon", icon);
            parent.removeClass("valid");
            parent.addClass("error");

            var editor = parent.children("label +");
            if (editor.length > 0 && editor[0].tagName === "DIV")
                editor.append(icon);
            else
                parent.append(icon);

            // icon.tooltip('destroy');
            icon.tooltip({ container: "body" });

            validator.resetErrorCount();
        };

        options.success = options.success || function (element) {
            var parent = element.data("icon").closest('.form-group');
            parent.find(".glyphicon.error.icon").remove();
            parent.removeClass("error");
            parent.addClass("valid");
        };

        options.invalidHandler = options.invalidHandler || function () {
            validator.resetErrorCount();
        };

        var validator = dom.validate(options);

        validator.resetErrorCount = function () {
            var cnt = validator.numberOfInvalids();

            if (args && args.invalidCount)
                args.invalidCount(cnt);

            if (!args.errorBadges)
                return;

            args.errorBadges.forEach(element => {
                element.text(cnt);
                element.attr("title", cnt + " 个错误");
                element.data("placement", "right");
                // element.tooltip('destroy');
                element.tooltip({ container: "body" });

                if (cnt > 0)
                    element.show();
                else
                    element.hide();
            });
        }

        validator.dispose = function () {
            dom.find(".error.icon").tooltip('destroy');
            args.errorBadges.forEach(element => {
                element.tooltip('destroy');
            });
        }

        validator.resetErrorCount();
        return validator;
    }


    return obj;
});