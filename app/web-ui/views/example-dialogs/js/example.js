define(["jquery", "vue", "bootstrap-dialog", "dialog"], function ($, Vue, BootstrapDialog, Dialog) {
    'use strict';

    var obj = {};

    obj.init = function (doc) {
        $("#btnSimple").click(function (e) {
            Dialog.showMessage("This is dialog title", "This is dialog message!");
        });
        $("#btnSimpleDefault").click(function (e) {
            Dialog.showMessageDefault("This is dialog title", "This is dialog message!");
        });
        $("#btnSimplePrimary").click(function (e) {
            Dialog.showMessagePrimary("This is dialog title", "This is dialog message!");
        });
        $("#btnSimpleSuccess").click(function (e) {
            Dialog.showMessageSuccess("This is dialog title", "This is dialog message!");
        });
        $("#btnSimpleInfo").click(function (e) {
            Dialog.showMessageInfo("This is dialog title", "This is dialog message!");
        });
        $("#btnSimpleWarning").click(function (e) {
            Dialog.showMessageWarning("This is dialog title", "This is dialog message!");
        });
        $("#btnSimpleDanger").click(function (e) {
            Dialog.showMessageDanger("This is dialog title", "This is dialog message!");
        });

        $("#btnConfirmCompleted").click(function (e) {
            Dialog.showConfirm("This is dialog title", "This is dialog message!",
                function (onCompleted, onError) {
                    setTimeout(function () { onCompleted(); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                }, {
                    confirmingText: "正在保存...",
                    icon: "fa fa-floppy-o",
                });
        });
        $("#btnConfirmError").click(function (e) {
            Dialog.showConfirm("This is dialog title", "This is dialog message!",
                function (onCompleted, onError) {
                    setTimeout(function () { onError(new Error("This is a test error.")); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                {
                    confirmingText: "正在保存...",
                    icon: "fa fa-floppy-o",
                });
        });

        $("#btnRemote").click(function (e) {
            Dialog.show("Login",
                {
                    pathhtml: "views/example-dialogs/html/login.html",
                    pathmodule: "",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    setTimeout(function () { onCompleted(); }, 2000000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    confirmingText: "正在登陆...",
                    icon: "fa fa-user-circle-o",
                    cssClass: "login-dialog",
                });
        });
        $("#btnRemoteModule").click(function (e) {
            Dialog.show("Login",
                {
                    pathhtml: "views/example-dialogs/html/login.html",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    setTimeout(function () { onCompleted(); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    confirmingText: "正在登陆...",
                    height: "250px",
                    icon: "fa fa-user-circle-o",
                });
        });
        $("#btnRemoteError").click(function (e) {
            Dialog.show("Login",
                {
                    pathhtml: "views/example-dialogs/html/login.html",
                    pathmodule: "",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    setTimeout(function () { onError(new Error("This is a test error.")); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    confirmingText: "正在登陆...",
                    height: "250px",
                    icon: "fa fa-user-circle-o",
                });
        });

        $("#btnRemoteConfirm").click(function (e) {
            Dialog.show("Login",
                {
                    pathhtml: "views/example-dialogs/html/login.html",
                    pathmodule: "",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    var email = this.plugin.dom.find("#email").val();
                    var password = this.plugin.dom.find("#password").val();
                    onCompleted();

                    Dialog.showMessageSuccess(undefined, "You input email: " + email + ", password: " + password);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    icon: "fa fa-user-circle-o",
                    height: "250px",
                });
        });

        $("#btnRemoteCustom").click(function (e) {
            Dialog.show("Login",
                {
                    pathhtml: "views/example-dialogs/html/login.html",
                    pathmodule: "",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    setTimeout(function () { onCompleted(); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    height: "250px",
                    icon: "fa fa-user-circle-o",
                    buttons: [{
                        label: "检测输入",
                        icon: 'fa fa-flag-checkered',
                        action: function (dialog) {
                            var email = dialog.plugin.dom.find("#email").val();
                            var password = dialog.plugin.dom.find("#password").val();
                            Dialog.showMessageSuccess(undefined, "You input email: " + email + ", password: " + password);
                        }
                    }],
                });
        });

        $("#btnCustomButtons").click(function (e) {
            var dlg = Dialog.contentDesignDialog("Login",
                {
                    pathhtml: "views/example-dialogs/html/login-custom-buttons.html",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    var _this = this;
                    setTimeout(function () {
                        var error = _this.plugin.instance.confirm();
                        if (error)
                            onError(error);
                        else
                            onCompleted();
                    }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    height: "250px",
                    icon: "fa fa-user-circle-o",
                    confirmText: "Login",
                    confirmingText: "正在登录...",
                    data: { password: "123456" }
                });

            dlg.open();
        });

        $("#btnTabs").click(function (e) {
            var dlg = Dialog.dialog("Options",
                {
                    pathhtml: "views/example-dialogs/html/login-tabs.html",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    setTimeout(function () { onCompleted(); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    height: "250px",
                    icon: "fa fa-cog",
                });

            dlg.open();
        });

        $("#btnFullScreen").click(function (e) {
            var dlg = Dialog.dialog("Options",
                {
                    pathhtml: "views/example-dialogs/html/login-tabs.html",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    setTimeout(function () { onCompleted(); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    icon: "fa fa-cog",
                    cssClass: "modal-full-screen",
                    draggable: false,
                });

            dlg.open();
        });

        $("#btnFullDesign").click(function (e) {
            var dlg = Dialog.fullDesignDialog("Options",
                {
                    pathhtml: "views/example-dialogs/html/dlg-full-screen-design.html",
                },
                function () {
                    console.log("dialog Shown");
                },
                function (onCompleted, onError) {
                    setTimeout(function () { onCompleted(); }, 2000);
                },
                function () {
                    console.log("dialog cancel");
                },
                function () {
                    console.log("dialog closed");
                },
                {
                    icon: "fa fa-user-circle-o",
                    cssClass: "modal-full-screen",
                    confirmText: "Confirm",
                    confirmingText: "Saving...",
                    draggable: false,
                });

            dlg.open();
        });
    };

    return obj;
});