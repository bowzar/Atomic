define(["jquery", "vue", "three", "stats", "tween"], function ($, Vue, THREE, Stats, TWEEN) {
    'use strict';

    var Shell = function () {

        this.isStopPending = false;

        this.stats = null;

        this.canvas = null;

        this.render = null;
        this.width = null;
        this.height = null;

        this.camera = null;
        this.scene = null;
        this.light = null;

        this.plane = null;

        this.self = null;
        this.selfCamera = {};
        this.selfMatrix = null;
        this.selfMatrixBackup = null;
        this.selfVisualMatrix = null;
        this.selfVisualMatrixBackup = null;
        // this.selfVisualMatrixZ = null;
        // this.selfVisualMatrixZBackup = null;
        this.selfThetaZ = null;
        this.selfThetaZBackup = null;
        this.keysStatus = [];

        this.tweenCamera = null;

        this.angle = -10;

        this.isRotateCamera = false;
        this.startPoint = null;
        this.isRotateByRight = false;

        this.speedrate = 0.2;
        this.rotaterate = -0.007;
        this.rotateZrate = -0.001;
        this.zoomrate = 0.1;
        this.jumpHeight = 30;
        this.jumpGroup = null;
        this.jumping = false;

        this.cameraLength = 300;
        this.cameraLengthTarget = { cameraLength: this.cameraLength };

        this.gridSize = 50;
        this.gridCount = 200;


        function initThree(doc) {

            var $frame = doc.find("#three-container");
            this.width = $frame.width();
            this.height = $frame.height();

            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });

            this.renderer.setSize(this.width, this.height);
            this.renderer.setClearColor(0xFFFFFF, 1.0);
            this.renderer.shadowMap.enabled = true;
            // this.renderer.shadowMap.autoUpdate = true;
            // this.renderer.shadowMap.needsUpdate = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            $frame.append($(this.renderer.domElement));

            this.stats = new Stats();
            this.stats.setMode(0);
            $(this.stats.domElement).addClass("three-stats");
            $frame.append($(this.stats.domElement));

            this.canvas = $(this.renderer.domElement);
            this.canvas.attr("tabindex", 0);
            this.canvas.on("keydown", this, onKeyDown);
            this.canvas.on("keyup", this, onKeyUp);
            this.canvas.on("mousedown", this, onMouseDown);
            this.canvas.on("mouseup", this, onMouseUp);
            this.canvas.on("mousemove", this, onMouseMove);
            this.canvas.on("mousewheel", this, onMouseWheel);
            this.canvas.on("contextmenu", function (e) { e.preventDefault(); });

            this.canvas.focus();

            this.jumpGroup = new TWEEN.Group();
        }

        function onKeyDown(e) {

            console.log(e.key);
            if (e.key === "w" || e.key === "s" || e.key === "a" || e.key === "d") {

                if (!e.data.keysStatus[e.key])
                    e.data.keysStatus[e.key] = {};

                if (e.data.keysStatus[e.key].isPress)
                    return;

                e.data.keysStatus[e.key] = {
                    isPress: true,
                    time: new Date().getTime()
                };
            }
            else if (e.key === " ") {

                if (e.data.jumping)
                    return;

                e.data.jumping = true;
                var t0 = new TWEEN.Tween(e.data.self.position, e.data.jumpGroup)
                    .to({ z: [e.data.jumpHeight, 5.1] }, 700)
                    .easing(TWEEN.Easing.Sinusoidal.Out)
                    .onComplete(function (object) {
                        e.data.jumpGroup.removeAll();
                        e.data.jumping = false;
                    })
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                // .repeat(Infinity);

                t0.start();
            }
        }

        function onKeyUp(e) {

            console.log(e.key);
            if (e.key === "w" || e.key === "s" || e.key === "a" || e.key === "d") {
                e.data.keysStatus[e.key] = {
                    isPress: false,
                    time: new Date().getTime()
                };
            }
        }

        function onMouseDown(e) {
            if (e.data.isRotateCamera)
                return;
            if (e.button !== 2 && e.button !== 0)
                return;

            e.data.isRotateByRight = e.button === 2;
            e.data.isRotateCamera = true;
            e.data.startPoint = { x: e.offsetX, y: e.offsetY };
            e.data.selfVisualMatrixBackup = e.data.selfVisualMatrix;
            e.data.selfThetaZBackup = e.data.selfThetaZ;

            e.preventDefault();
        }

        function onMouseUp(e) {
            if (!e.data.isRotateCamera)
                return;
            if (e.button !== 2 && e.button !== 0)
                return;

            e.data.isRotateByRight = false;
            e.data.isRotateCamera = false;
            e.data.startPoint = null;
            e.data.selfVisualMatrixBackup = null;
            e.data.selfThetaZBackup = null;

            e.preventDefault();
        }

        function onMouseMove(e) {

            e.data.canvas.focus();

            if (!e.data.isRotateCamera)
                return;

            var x = e.offsetX;
            var y = e.offsetY;

            var dx = x - e.data.startPoint.x;
            var theta = dx * e.data.rotaterate;

            var current = new THREE.Matrix4();
            current.makeRotationZ(theta);

            e.data.selfVisualMatrix = e.data.selfVisualMatrixBackup.clone();
            e.data.selfVisualMatrix.multiply(current);

            if (e.data.isRotateByRight) {
                e.data.selfMatrix = e.data.selfVisualMatrix.clone();
            }

            var dy = y - e.data.startPoint.y;
            var thetaZ = dy * e.data.rotaterate;

            var nextThetaZ = e.data.selfThetaZBackup + thetaZ;
            if (nextThetaZ > 89 * Math.PI / 180)
                nextThetaZ = 89 * Math.PI / 180;
            if (nextThetaZ < -89 * Math.PI / 180)
                nextThetaZ = -89 * Math.PI / 180;
            e.data.selfThetaZ = nextThetaZ;

            e.preventDefault();
        }

        function onMouseWheel(e, delta) {

            var length = e.data.cameraLengthTarget.cameraLength - delta * e.data.cameraLengthTarget.cameraLength * e.data.zoomrate;
            if (length <= 0)
                length = 0;

            e.data.cameraLengthTarget.cameraLength = length;
            e.data.tweenCamera.start();
        }

        function initCamera() {
            this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 1, 10000);
            // this.camera.position.x = 0;
            // this.camera.position.y = -350;
            // this.camera.position.z = 50;
            this.camera.up.x = 0;
            this.camera.up.y = 0;
            this.camera.up.z = 1;
            // this.camera.lookAt(new THREE.Vector3(0, 0, 50));
            // this.camera.rotation.z = 30 * Math.PI / 180;

            // var t0 = new TWEEN.Tween(this.camera.position)
            //     .to({ y: 1000, z: 1000 }, 3000);
            // var t1 = new TWEEN.Tween(this.camera.position)
            //     .to({ y: 1000, z: -1000 }, 3000);
            // var t2 = new TWEEN.Tween(this.camera.position)
            //     .to({ y: -1000, z: -1000 }, 3000);
            // var t3 = new TWEEN.Tween(this.camera.position)
            //     .to({ y: -1000, z: 1000 }, 3000);


            this.tweenCamera = new TWEEN.Tween(this)
                .to(this.cameraLengthTarget, 500)
                // .repeat(Infinity)
                .start();

            // t0.chain(t1);
            // t1.chain(t2);
            // t2.chain(t3);
            // t3.chain(t0);

            // this.selfCamera.x = 0;
            // this.selfCamera.y = -150;
            // this.selfCamera.z = 50;

            this.selfMatrix = new THREE.Matrix4();
            this.selfVisualMatrix = new THREE.Matrix4();
            // this.selfVisualMatrixZ = new THREE.Matrix4();
            this.selfThetaZ = -30 * Math.PI / 180;
            // this.selfVisualMatrixZ.makeRotationX(30 * Math.PI / 180);

        }

        function initScene() {
            this.scene = new THREE.Scene();
        }

        function initLight() {

            var al = new THREE.AmbientLight(0xa0a0a0);
            // al.castShadow = true;
            this.scene.add(al);

            this.light = new THREE.DirectionalLight(0xffffff, 1);
            this.light.position.set(100, 120, 1000);
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = 1024;
            this.light.shadow.mapSize.height = 1024;
            this.light.shadow.camera.near = -1024;
            this.light.shadow.camera.far = 2096;
            // this.light.shadow.radius = 1;
            this.light.shadow.camera.left = -1024;
            this.light.shadow.camera.right = 1024;
            this.light.shadow.camera.top = -1024;
            this.light.shadow.camera.bottom = 1024;


            this.scene.add(this.light);
            // this.scene.add(new THREE.CameraHelper(this.light.shadow.camera));

            // var spotLight = new THREE.SpotLight(0xffffff);
            // spotLight.position.set(150, -100, 200);
            // spotLight.castShadow = true;    // 让光源产生阴影
            // // spotLight.angle = Math.PI / 3;//光源的角度
            // // spotLight.shadow.camera.near = -1000;
            // // spotLight.shadow.camera.far = 1500;
            // // spotLight.shadow.mapSize.width = 3000;
            // // spotLight.shadow.mapSize.height = 3000;
            // // spotLight.shadow.camera.left = -1500;
            // // spotLight.shadow.camera.right = 1500;
            // // spotLight.shadow.camera.top = -1500;
            // // spotLight.shadow.camera.bottom = 1500;
            // this.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));

            // THREE.CameraHelper(spotLight.shadow.camera);

            // this.scene.add(spotLight);

        }

        function initObject() {

            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(-this.gridSize * this.gridCount / 2, 0, 0));
            geometry.vertices.push(new THREE.Vector3(this.gridSize * this.gridCount / 2, 0, 0));

            for (var i = 0; i <= this.gridCount; i++) {

                var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xcccccc, opacity: 0.2 }));
                line.position.y = (i * this.gridSize) - this.gridSize * this.gridCount / 2;
                this.scene.add(line);

                var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xcccccc, opacity: 0.2 }));
                line.position.x = (i * this.gridSize) - this.gridSize * this.gridCount / 2;
                line.rotation.z = 90 * Math.PI / 180;
                this.scene.add(line);
            }

            var geometry = new THREE.CubeGeometry(10, 40, 10);
            var material = new THREE.MeshLambertMaterial({ color: 0xFF9025 });

            this.self = new THREE.Mesh(geometry, material);
            this.self.position.x = 0;
            this.self.position.y = 0;
            this.self.position.z = 5.01;
            this.self.castShadow = true;
            // this.self.receiveShadow = true;
            // this.self.rotation.z = this.angle * Math.PI / 180;

            this.scene.add(this.self);

            this.light.target = this.self;

            var geometry = new THREE.PlaneGeometry(this.gridSize * this.gridCount, this.gridSize * this.gridCount);
            var material = new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.5,
            });

            this.plane = new THREE.Mesh(geometry, material);
            this.plane.position.z = 0;
            this.plane.receiveShadow = true;
            this.scene.add(this.plane);



            var frontMainCoords = [
                [-80, -30], [-80, 20], [50, 20], [50, 0], [20, -30], [-80, -30]
            ];
            var frontMainCoordsHole = [
                [-70, -20], [-70, 10], [40, 10], [40, 0], [10, -20], [-70, -20]
            ];
            var frontMainShape = makeShape(frontMainCoords, frontMainCoordsHole);
            var frontMainGeometry = makeExtrudeGeometry(frontMainShape, 10);


            var material = new THREE.MeshLambertMaterial({ color: 0xFF9025, side: THREE.DoubleSide, });

            var mesh = new THREE.Mesh(frontMainGeometry, material);
            mesh.castShadow = true;

            this.scene.add(mesh);
        }

        function makeExtrudeGeometry(shape, amount) {
            var extrudeSetting = {
                steps: 1,
                amount: amount,
                bevelEnabled: false
            }
            var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSetting)
            // geometry.rotateX(-0.5 * Math.PI)
            return geometry
        }

        function makeShape() {
            var shape
            if (arguments.length) {
                var arry = arguments[0]
                shape = new THREE.Shape()
                shape.moveTo(arry[0][0], arry[0][1])
                for (var i = 1; i < arry.length; i++) {
                    shape.lineTo(arry[i][0], arry[i][1])
                }
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        var pathCoords = arguments[i]
                        var path = new THREE.Path()
                        path.moveTo(pathCoords[0][0], pathCoords[0][1])
                        for (var i = 1; i < pathCoords.length; i++) {
                            path.lineTo(pathCoords[i][0], pathCoords[i][1])
                        }
                        shape.holes.push(path)
                    }
                }
                return shape
            } else {
                console.error('Something wrong!')
            }
        }


        function updateSelf() {

            var current = new Date().getTime();
            var vector = new THREE.Vector3();
            var time;

            if (this.keysStatus.w && this.keysStatus.w.isPress) {
                vector.y += 1;
                time = this.keysStatus.w.time;
                this.keysStatus.w.time = current;
            }
            if (this.keysStatus.s && this.keysStatus.s.isPress) {
                vector.y -= 1;
                time = this.keysStatus.s.time;
                this.keysStatus.s.time = current;
            }
            if (this.keysStatus.a && this.keysStatus.a.isPress) {
                vector.x -= 1;
                time = this.keysStatus.a.time;
                this.keysStatus.a.time = current;
            }
            if (this.keysStatus.d && this.keysStatus.d.isPress) {
                vector.x += 1;
                time = this.keysStatus.d.time;
                this.keysStatus.d.time = current;
            }

            if (!time)
                time = current;

            var length = (current - time) * this.speedrate;

            vector.applyMatrix4(this.selfMatrix);
            vector.setLength(length);

            this.self.position.x += vector.x;
            this.self.position.y += vector.y;
            this.self.setRotationFromMatrix(this.selfMatrix);

            // vector.setLength(-180);

            var selfVisualMatrixZ = new THREE.Matrix4();
            selfVisualMatrixZ.makeRotationX(this.selfThetaZ);

            var distance = new THREE.Vector3(0, 1, 0);
            distance.applyMatrix4(selfVisualMatrixZ);
            distance.applyMatrix4(this.selfVisualMatrix);
            distance.setLength(-this.cameraLength);

            // var distanceZ = new THREE.Vector3(0, 150, 0);
            // distanceZ.applyMatrix4(selfVisualMatrixZ);

            this.camera.position.x = this.self.position.x + distance.x;
            this.camera.position.y = this.self.position.y + distance.y;
            this.camera.position.z = distance.z;

            this.light.position.x = this.self.position.x + 300;
            this.light.position.y = this.self.position.y + 400;

            // this.light.shadow.camera.left = this.light.position.x - 1024;
            // this.light.shadow.camera.right = this.light.position.x + 1024;
            // this.light.shadow.camera.top = this.light.position.y - 1024;
            // this.light.shadow.camera.bottom = this.light.position.y + 1024;

            // this.light.camera.lookAt(this.self.position.x, this.self.position.y, this.self.position.z);
            this.camera.lookAt(this.self.position.x, this.self.position.y, this.self.position.z);
        }

        var _this = this;
        function render() {
            _this.renderer.clear();
            _this.renderer.render(_this.scene, _this.camera);


            updateSelf.call(_this);

            // _this.camera.position.y = Math.round(_this.camera.position.y);
            // _this.camera.position.z = Math.round(_this.camera.position.z);
            // _this.camera.lookAt(0, 0, 0);

            // console.log("y:" + _this.camera.position.y + "   " + "z:" + _this.camera.position.z);

            if (_this.isStopPending)
                return;

            requestAnimationFrame(render);

            _this.stats.update();
            TWEEN.update();
            _this.jumpGroup.update();
        }

        function threeStart(doc) {
            initThree.call(this, doc);
            initCamera.call(this);
            initScene.call(this);
            initLight.call(this);
            initObject.call(this);
            render();
        }

        this.dispose = function (doc) {
            this.canvas.off("keydown");
            this.canvas.off("keyup");
            this.canvas.off("mousedown");
            this.canvas.off("mouseup");
            this.canvas.off("mousemove");
            this.canvas.off("mousewheel");
            this.canvas.off("contextmenu");

            this.isStopPending = true;
            this.tweenCamera.stop();
        };

        this.init = function (doc) {
            threeStart.call(this, doc);
        };
    }

    return Shell;
});