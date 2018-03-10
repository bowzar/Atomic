define(["jquery", "vue", "three"], function ($, Vue, THREE) {
    'use strict';

    var Shell = function () {

        this.isStopPending = false;

        this.dispose = function () {
            this.isStopPending = true;
        }

        this.init = function (doc) {

            var $frame = doc.find("#three-container");
            var width = $frame.width();
            var height = $frame.height();

            var renderer = new THREE.WebGLRenderer({
                antialias: true
            });

            renderer.setSize(width, height);
            renderer.setClearColor(0xffffff);
            $frame.append($(renderer.domElement));

            var scene = new THREE.Scene();

            var geometry = new THREE.CubeGeometry(2, 2, 2);
            var material = new THREE.MeshBasicMaterial({ color: 0xf26ea4 });
            var cube1 = new THREE.Mesh(geometry, material);
            scene.add(cube1);

            // geometry = new THREE.CubeGeometry(2, 3, 4);
            // material = new THREE.MeshBasicMaterial({ color: 0xf26ea4 });
            // var cube2 = new THREE.Mesh(geometry, material);
            // scene.add(cube2);

            var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 5;

            var _this = this;
            function render() {

                cube1.rotation.x += 0.01;
                cube1.rotation.y += 0.02;
                cube1.rotation.z += 0.01;

                renderer.render(scene, camera);
                if (_this.isStopPending)
                    return;

                requestAnimationFrame(render);
            }

            render();
        };
    };

    return Shell;
});