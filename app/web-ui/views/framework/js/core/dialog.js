define(["jquery", "plugin-context", "bootstrap-dialog", "actionqueue"], function ($, PluginContext, BootstrapDialog, ActionQueue) {
    'use strict';

    var dialog = {};


    var createIconTitle = function (title, options) {
        if (options && options.icon)
            return $("<div style='display: flex;align-items: center;'><span class='modal-header-icon " + options.icon + "'></span><span class='modal-header-title'>" + title + "</span></div>")
        else
            return title;
    }

    var getMessageDialogOptions = function (title, msg, onhide, onshow) {
        return {
            draggable: true,
            type: BootstrapDialog.TYPE_DEFAULT,
            title: title || "提示",
            message: msg,
            cssClass: 'message-dialog',
            buttons: [{
                label: '关闭',
                icon: 'glyphicon glyphicon-log-out',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }],
            onhide: onhide,
            onshow: onshow,
        };
    };

    var getConfirmDialogOptions = function (title, msg, onConfirm, onCancel, options) {

        var isConfirm = false;

        title = createIconTitle(title, options);

        return {
            draggable: true,
            closeByBackdrop: false,
            type: BootstrapDialog.TYPE_DEFAULT,
            title: title,
            message: msg,
            cssClass: 'message-dialog',
            buttons: [{
                label: options && options.confirmText ? options.confirmText : '确定',
                icon: 'glyphicon glyphicon-check',
                cssClass: 'btn-primary',
                action: function (dialogItself) {
                    isConfirm = true;

                    if (onConfirm) {

                        var $button = this;
                        $button.spin();
                        dialogItself.enableButtons(false);
                        dialogItself.setClosable(false);

                        if (options && options.confirmingText) {
                            $button.prop('lastChild').nodeValue = options.confirmingText;
                        }

                        onConfirm.call(dialogItself, function () {
                            $button.prop('lastChild').nodeValue = options && options.confirmText ? options.confirmText : '确定';
                            dialogItself.setClosable(true);
                            dialogItself.close();
                            $button.stopSpin();

                        }, function (error) {
                            $button.prop('lastChild').nodeValue = options && options.confirmText ? options.confirmText : '确定';
                            dialogItself.enableButtons(true);
                            dialogItself.setClosable(true);
                            $button.stopSpin();
                            if (error)
                                dialog.showMessageDanger("错误", error.toString());
                        });
                    }
                    else {
                        dialogItself.close();
                    }
                }
            }, {
                label: options && options.cancelText ? options.cancelText : '取消',
                icon: 'glyphicon glyphicon-log-out',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }],
            onhide: function (dialogItself) {
                if (!isConfirm && onCancel)
                    onCancel.call(dialogItself);
            },
        };
    };

    var createRemoteDialog = function (title, pluginOptions, onshown, onConfirm, onCancel, onClosed, options) {

        options = options || {};

        var aq = new ActionQueue();
        var plugin = new PluginContext(pluginOptions);
        var $message = $('<div class="modal-body-frame"></div>');
        var $content = $('<div id="modal-body-content"></div>');
        var $busy = $('<div class="loading-container"><div class="loading"><span></span><span></span><span></span><span></span><span></span></div></div>');
        $message.append($content);
        $message.append($busy);
        $content.hide();

        var buttons = [];
        if (options && options.buttons && options.buttons instanceof Array) {
            $.each(options.buttons, function () { buttons.push(this); });
        }

        var confirmingProc = function (dialogItself, event, $targetButton) {

            if (onConfirm) {

                var $button = $targetButton || this;
                $button.spin();
                dialogItself.enableButtons(false);
                $content.find(".modal-footer .btn").attr("disabled", true);
                dialogItself.setClosable(false);
                // $content.attr("disabled", true);

                if (options && options.confirmingText) {
                    $button.prop('lastChild').nodeValue = options.confirmingText;
                }

                onConfirm.call(dialogItself, function () {
                    isConfirm = true;
                    $button.prop('lastChild').nodeValue = options && options.confirmText ? options.confirmText : '确定';
                    dialogItself.setClosable(true);
                    dialogItself.close();
                    $button.stopSpin();
                    // $content.attr("disabled", false);

                }, function (error) {
                    $button.prop('lastChild').nodeValue = options && options.confirmText ? options.confirmText : '确定';
                    dialogItself.enableButtons(true);
                    $content.find(".modal-footer .btn").attr("disabled", false);
                    dialogItself.setClosable(true);
                    $button.stopSpin();
                    // $content.attr("disabled", false);
                    if (error)
                        dialog.showMessageDanger("错误", error.toString());
                });
            }
            else {
                dialogItself.close();
            }
        }

        if (!(options && options.hasConfirm === false))
            buttons.push({
                label: options && options.confirmText ? options.confirmText : '确定',
                icon: 'glyphicon glyphicon-check',
                cssClass: 'btn-primary',
                action: confirmingProc,
            });

        if (!(options && options.hasCancel === false))
            buttons.push({
                label: options && options.cancelText ? options.cancelText : '取消',
                icon: 'glyphicon glyphicon-log-out',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            });

        title = createIconTitle(title, options);

        var isConfirm = false;
        var dlg = new BootstrapDialog({

            title: title,
            message: $message,
            draggable: options.draggable == undefined ? true : options.draggable,
            closeByBackdrop: false,
            type: BootstrapDialog.TYPE_PRIMARY,
            cssClass: options && options.cssClass ? 'remote-dialog ' + options.cssClass : "remote-dialog",

            buttons: buttons,

            onshow: function (dialogRef) {

                aq.do(function (next) {

                    if (options && options.height) {
                        // if (!options.setHeightOnContent)
                        dialogRef.getModalBody().css({ height: options.height });
                        // else
                        //     $message.css({ height: options.height });
                    }

                    dialogRef.setClosable(false);
                    dialogRef.getModalFooter().css({ visibility: "collapse" });

                    next();
                });
            },
            onshown: function (dialogRef) {
                aq.do(function (next) {
                    plugin.loadHtml().then(function (html) {

                        plugin.dom = $content.html(html);

                        setTimeout(function () {
                            plugin.requireEntry().then(function (instance) {
                                if (instance)
                                    instance.dialog = dialogRef;

                                var completed = function (onShownCallback) {
                                    dialogRef.setClosable(true);
                                    dialogRef.getModalFooter().css({ visibility: "visible" });
                                    $busy.hide();
                                    $content.show();

                                    if (options.fullDesign) {
                                        dialogRef.getModalHeader().hide();
                                        dialogRef.getModalFooter().hide();
                                        dialogRef.getModalBody().addClass("modal-full-design");

                                        $content.find(".bootstrap-dialog-body > div").addClass("dialog-content-show");
                                    }
                                    else {
                                        $content.addClass("dialog-content-show");
                                    }

                                    setTimeout(function () {
                                        if (onshown)
                                            onshown();

                                        if (onShownCallback)
                                            onShownCallback();

                                        next();
                                    }, 1);
                                };

                                if (instance && instance.startup) {
                                    instance.startup(options && options.data ? options.data : undefined, completed);
                                }
                                else
                                    completed();

                                dialogRef.isShown = true;

                            }).catch(function (error) {
                                dialogRef.setClosable(true);
                                dialogRef.setType(BootstrapDialog.TYPE_DANGER);
                                $busy.remove();
                                $content.html(error);
                                $content.show();
                                $content.addClass("dialog-content-show");
                                next();
                            });
                        }, 100);

                    }).catch(function (error) {
                        dialogRef.setClosable(true);
                        dialogRef.setType(BootstrapDialog.TYPE_DANGER);
                        $busy.remove();
                        $content.html(error);
                        $content.show();
                        $content.addClass("dialog-content-show");
                        dialogRef.isShown = true;
                        next();
                    });
                });
            },
            onhide: function (dialogRef) {
                if (!isConfirm && onCancel)
                    onCancel.call(dialogRef);

                dlg.isClosing = true;
            },
            onhidden: function (dialogRef) {

                if (onClosed)
                    onClosed();

                plugin.dispose();
                dlg.plugin = null;
                dlg.closeConfirm = null;
                if (plugin.instance)
                    plugin.instance.dialog = null;

                dlg.isShow = false;
                dlg.isShown = false;
                dlg.isClosed = true;
                dlg.isClosing = false;
            },
        });

        dlg.plugin = plugin;
        dlg.closeConfirm = function ($button) {
            dlg.enhanceButton($button);
            confirmingProc(dlg, undefined, $button);
        };
        dlg.full = function () {
            dlg.getModal().addClass("modal-full-screen");
        };
        dlg.setCaptionText = function (txt) {
            dlg.getModalHeader().find(".bootstrap-dialog-title .modal-header-title").html(txt);
        };
        dlg.show = function (data) {
            if (options && data)
                options.data = data;

            dlg.isShow = true;
            dlg.open();
        };
        dlg.refresh = function (args) {

            aq.do(function (next) {
                if (!(dlg.plugin.instance && dlg.plugin.instance.refresh)) {
                    next();
                    return;
                }

                dlg.setClosable(false);
                dlg.getModalFooter().css({ visibility: "collapse" });
                $busy.show();
                $content.hide();

                setTimeout(() => {
                    dlg.plugin.instance.refresh(args, function () {
                        dlg.setClosable(true);
                        dlg.getModalFooter().css({ visibility: "visible" });
                        $busy.hide();
                        $content.show();
                        next();
                    });
                }, 200);
            });
        };

        return dlg;
    };

    var createRemoteDialogShell = function (title, pluginOptions, onshown, onConfirm, onCancel, onClosed, options) {

        var dlg = createRemoteDialog(title, pluginOptions,
            function () {
                if (dlg.plugin.instance && dlg.plugin.instance.onShown)
                    dlg.plugin.instance.onShown(function () {
                        if (onshown)
                            onshown.call(dlg);
                    });
                else if (onshown) {
                    onshown.call(dlg);
                }
            },
            function (onCompleted, onError) {
                if (dlg.plugin.instance && dlg.plugin.instance.onConfirm)
                    dlg.plugin.instance.onConfirm(onCompleted, onError, function () {
                        if (onConfirm)
                            onConfirm.call(dlg, onCompleted, onError);
                    });
                else if (onConfirm) {
                    onConfirm.call(dlg, onCompleted, onError);
                }
            },
            function () {
                if (dlg.plugin.instance && dlg.plugin.instance.onCancel)
                    dlg.plugin.instance.onCancel(function () {
                        if (onCancel)
                            onCancel.call(dlg);
                    });
                else if (onCancel) {
                    onCancel.call(dlg);
                }
            },
            function () {
                if (dlg.plugin.instance && dlg.plugin.instance.onClosed)
                    dlg.plugin.instance.onClosed(function () {
                        if (onClosed)
                            onClosed.call(dlg);
                    });
                else if (onClosed) {
                    onClosed.call(dlg);
                }
            }, options);

        return dlg;
    };

    dialog.show = function (title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options) {
        var dlg = createRemoteDialogShell(title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options);
        dlg.open();
        return dlg;
    };

    dialog.dialog = function (title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options) {

        // options.setHeightOnContent = true;

        var dlg = createRemoteDialogShell(title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options);
        dlg.realize();
        // dlg.getModalBody().addClass("remote-modal-body");
        // dlg.getModalFooter().hide();
        return dlg;
    };

    dialog.contentDesignDialog = function (title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options) {

        // options.setHeightOnContent = true;

        var dlg = createRemoteDialogShell(title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options);
        dlg.realize();
        dlg.getModalBody().addClass("remote-modal-body");
        // dlg.getModalFooter().hide();
        return dlg;
    };

    dialog.fullDesignDialog = function (title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options) {

        // options.setHeightOnContent = true;

        options.fullDesign = true;
        var dlg = createRemoteDialogShell(title, pluginOptions, onShown, onConfirm, onCancel, onClosed, options);
        dlg.realize();


        return dlg;
    };

    dialog.showMessage = function (title, msg, onhide, onshow) {
        this.showMessagePrimary(title, msg, onhide, onshow);
    };
    dialog.showMessageDefault = function (title, msg, onhide, onshow) {
        var options = getMessageDialogOptions(title, msg, onhide, onshow);
        options.type = BootstrapDialog.TYPE_DEFAULT;
        BootstrapDialog.show(options);
    };
    dialog.showMessagePrimary = function (title, msg, onhide, onshow) {
        var options = getMessageDialogOptions(title, msg, onhide, onshow);
        options.type = BootstrapDialog.TYPE_PRIMARY;
        BootstrapDialog.show(options);
    };
    dialog.showMessageInfo = function (title, msg, onhide, onshow) {
        var options = getMessageDialogOptions(title, msg, onhide, onshow);
        options.type = BootstrapDialog.TYPE_INFO;
        options.title = title || "信息";
        BootstrapDialog.show(options);
    };
    dialog.showMessageSuccess = function (title, msg, onhide, onshow) {
        var options = getMessageDialogOptions(title, msg, onhide, onshow);
        options.type = BootstrapDialog.TYPE_SUCCESS;
        options.title = title || "信息";
        BootstrapDialog.show(options);
    };
    dialog.showMessageWarning = function (title, msg, onhide, onshow) {
        var options = getMessageDialogOptions(title, msg, onhide, onshow);
        options.type = BootstrapDialog.TYPE_WARNING;
        options.title = title || "警告";
        BootstrapDialog.show(options);
    };
    dialog.showMessageDanger = function (title, msg, onhide, onshow) {
        var options = getMessageDialogOptions(title, msg, onhide, onshow);
        options.type = BootstrapDialog.TYPE_DANGER;
        options.title = title || "错误";
        BootstrapDialog.show(options);
    };


    dialog.showConfirm = function (title, msg, onConfirm, onCancel, options) {
        this.showConfirmPrimary(title, msg, onConfirm, onCancel, options);
    };
    dialog.showConfirmDefault = function (title, msg, onConfirm, onCancel, options) {
        var options = getConfirmDialogOptions(title, msg, onConfirm, onCancel, options);
        options.type = BootstrapDialog.TYPE_DEFAULT;
        BootstrapDialog.show(options);
    };
    dialog.showConfirmPrimary = function (title, msg, onConfirm, onCancel, options) {
        var options = getConfirmDialogOptions(title, msg, onConfirm, onCancel, options);
        options.type = BootstrapDialog.TYPE_PRIMARY;
        BootstrapDialog.show(options);
    };
    dialog.showConfirmInfo = function (title, msg, onConfirm, onCancel, options) {
        var options = getConfirmDialogOptions(title, msg, onConfirm, onCancel, options);
        options.type = BootstrapDialog.TYPE_INFO;
        BootstrapDialog.show(options);
    };
    dialog.showConfirmSuccess = function (title, msg, onConfirm, onCancel, options) {
        var options = getConfirmDialogOptions(title, msg, onConfirm, onCancel, options);
        options.type = BootstrapDialog.TYPE_SUCCESS;
        BootstrapDialog.show(options);
    };
    dialog.showConfirmWarning = function (title, msg, onConfirm, onCancel, options) {
        var options = getConfirmDialogOptions(title, msg, onConfirm, onCancel, options);
        options.type = BootstrapDialog.TYPE_WARNING;
        BootstrapDialog.show(options);
    };
    dialog.showConfirmDanger = function (title, msg, onConfirm, onCancel, options) {
        var options = getConfirmDialogOptions(title, msg, onConfirm, onCancel, options);
        options.type = BootstrapDialog.TYPE_DANGER;
        BootstrapDialog.show(options);
    };

    return dialog;
});