define(["jquery", "vue"], function ($, Vue) {
    'use strict';

    var obj = {};

    obj.init = function (doc) {

        $("#file").on("change", function (e) {

            var reader = new FileReader();

            reader.readAsDataURL(this.files[0]);
            reader.onload = function (f) {
                $("#txtbase64").val(this.result);
                $("#imagePreview").html($("<img src='" + this.result + "'>"));
            }
        });

    };

    return obj;
});