define(["jquery"], function ($) {
    'use strict';

    var obj = {};
    obj.getPage = function (element, completed) {

        var path = "/examples/" + element.dir + "/sourcecode";
        return $.get(path);

        // var gethtml = new Promise(function (resolve, reject) {
        //     $.get(getPath).then(function (page) {
        //         page.html = html;
        //         resolve(html);
        //     }).catch(function (error) {
        //         resolve("");
        //     });
        // });
        // var getjs = new Promise(function (resolve, reject) {
        //     // $.get(element.pathjs).then(function (js) {
        //     //     page.js = js;
        //     //     resolve(js);
        //     // }).catch(function (error) {
        //     //     resolve("");
        //     // });

        //     resolve("");
        // });
        // var getcss = new Promise(function (resolve, reject) {
        //     $.get(element.pathcss).then(function (css) {
        //         resolve(page.css = css);
        //     }).catch(function (error) {
        //         resolve("");
        //     });
        // });

        // return new Promise(function (resovle, reject) {
        //     Promise.all([gethtml, getjs, getcss])
        //         .then(function (results) {
        //             resovle(page);
        //         });
        // });
    };

    return obj;
});