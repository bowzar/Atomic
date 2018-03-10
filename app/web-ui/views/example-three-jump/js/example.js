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
        this.lightTween = null;
        this.lightLength = 300;
        this.lightTarget = { x: 0, y: 0, };

        this.plane = null;

        this.objs = [];
        this.currentIndex = -1;
        this.initialZ = 500;

        this.transparentMesh = null;

        this.cameraMatrix = null;
        this.cameraLength = 700;
        this.cameraTarget = { x: 0, y: 0, z: 0 };
        this.cameraTween = null;
        this.cameraCentre = { x: 0, y: 0, z: 0 };
        this.cameraCentreTarget = { x: 0, y: 0, z: 0 };
        this.cameraCentreTween = null;

        this.cameraAnimationDuration = 1000;
        this.meshDropAnimationDuration = 1000;
        this.jumpAnimationDuration = 450;
        this.jumpAnimationDurationZ = 550;
        this.jumpDeadDuration = 1000;

        this.unitSize = 50;
        this.meshSize = this.unitSize * 2;
        this.nextDistanceTimes = 2;

        this.gridSize = 200;
        this.gridCount = 500;

        this.jumpter = null;
        this.jumpterSize = 15;
        this.jumpterHeight = 30;
        this.jumpterJumpHeight = 150;
        this.jumpterReady = false;
        this.jumpterStartTime = null;
        this.jumpRate = this.unitSize / 170;
        this.jumpterGeometry = null;
        this.jumpterScaled = false;
        this.jumpD = null;
        this.jumpDescent = 1;

        this.isPress = false;
        this.jumpScaleRate = 0.000010;
        this.jumpScaleRateZ = 0.00002;
        this.jumpterScale = { x: 1, y: 1, z: 1 };
        this.jumpterScaleTarget = { x: 1, y: 1, z: 1 };

        this.isDead = false;

        this.enableTexture = true;

        this.images = [
            "517ab1434ab7a.jpg", "floor_wood_texture.jpg", "wood02.jpg",
            "wood_texture_2_by_rifificz-d38h5m7.jpg", "ShawSW1-1-2.jpg",
            "Wood_floor_texture_sketchup_warehouse_type075.jpg",
        ];

        // this.images = [
        //     "11.jpg"
        // ];

        // this.self = null;
        // this.selfCamera = {};
        // this.selfMatrix = null;
        // this.selfMatrixBackup = null;
        // this.selfVisualMatrix = null;
        // this.selfVisualMatrixBackup = null;
        // this.selfVisualMatrixZ = null;
        // this.selfVisualMatrixZBackup = null;
        // this.selfThetaZ = null;
        // this.selfThetaZBackup = null;
        // this.keysStatus = [];

        // this.tweenCamera = null;

        // this.angle = -10;

        // this.isRotateCamera = false;
        // this.startPoint = null;
        // this.isRotateByRight = false;

        // this.speedrate = 0.2;
        // this.rotaterate = -0.007;
        // this.rotateZrate = -0.001;
        // this.zoomrate = 0.1;
        // this.jumpHeight = 30;
        // this.jumpGroup = null;
        // this.jumping = false;

        // this.cameraLength = 300;

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

            // this.jumpGroup = new TWEEN.Group();


            var matrixX = new THREE.Matrix4();
            matrixX.makeRotationX(-45 * Math.PI / 180);
            var matrixZ = new THREE.Matrix4();
            matrixZ.makeRotationZ(-45 * Math.PI / 180);
            matrixX.multiply(matrixZ);

            this.cameraMatrix = matrixX;
        }

        function onKeyDown(e) {
            if (e.key === " " && e.data.isDead) {
                reset.call(e.data);
                return;
            }


            if (e.key === " " && !e.data.isPress) {

                if (!e.data.jumpterReady)
                    return;
                e.data.jumpterStartTime = new Date().getTime();
                e.data.isPress = true;
                e.preventDefault();
            }

        }

        function onKeyUp(e) {

            if (e.key === " " && e.data.isPress) {
                e.preventDefault();

                if (!e.data.jumpterReady || !e.data.jumpterStartTime)
                    return;

                e.data.isPress = false;
                var time = new Date().getTime();
                var dt = time - e.data.jumpterStartTime;

                var length = dt * e.data.jumpRate;

                var v2 = getMeshCentre.call(e.data, e.data.currentIndex);
                v2.z = 0;

                var v1 = new THREE.Vector3(e.data.jumpter.position.x, e.data.jumpter.position.y, 0);

                v2.x -= v1.x;
                v2.y -= v1.y;

                var v = v2;
                v.setLength(length);

                e.data.jumpterReady = false;

                var _this = e.data;
                var tweenXY = new TWEEN.Tween(_this.jumpter.position)
                    .to({
                        x: e.data.jumpter.position.x + v.x,
                        y: e.data.jumpter.position.y + v.y,
                    }, _this.jumpAnimationDuration)
                    .easing(TWEEN.Easing.Linear.None)
                    .onComplete(function (obj) {
                        TWEEN.remove(tweenXY);
                        // _this.jumpterReady = true;

                        // var has = checkPosition.call(_this);
                        // if (has === 0)
                        //     return;
                        // if (has > 0)
                        //     nextMesh.call(_this);
                        // else
                        //     dead.call(this);
                    })
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                    .delay(50)
                    .start();

                var tweenZ = new TWEEN.Tween(_this.jumpter.position)
                    .to({
                        z: [e.data.jumpterJumpHeight, e.data.jumpter.position.z]
                    }, _this.jumpAnimationDurationZ)
                    .easing(TWEEN.Easing.Linear.None)
                    .onComplete(function (obj) {
                        TWEEN.remove(tweenZ);
                        _this.jumpterReady = true;

                        var has = checkPosition.call(_this);
                        if (has === 0)
                            return;
                        if (has > 0)
                            nextMesh.call(_this);
                        else
                            dead.call(_this);
                    })
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                    .start();


                var d = _this.jumpD === "x" ? "y" : "x";
                var to = {};
                to[d] = d === "x" ? -360 * Math.PI / 180 : 360 * Math.PI / 180;

                var tweenR = new TWEEN.Tween(_this.jumpter.rotation)
                    .to(to, _this.jumpAnimationDuration)
                    .easing(TWEEN.Easing.Linear.None)
                    .onComplete(function (obj) {
                        TWEEN.remove(tweenR);
                        _this.jumpter.rotation[d] = 0;
                    })
                    .start();

            }

        }

        function onMouseDown(e) {


            if (e.data.isDead)
                reset.call(e.data);


        }

        function reset() {

            var _this = this;
            this.objs.forEach(element => {
                // var selectedObject = _this.scene.getObjectByName(element.name);
                _this.scene.remove(element.mesh);
            });

            this.objs = [];
            this.currentIndex = -1;

            this.scene.remove(this.jumpter);
            this.jumpter = null;
            this.isDead = false;
            firstMesh.call(this);
        }

        function onMouseUp(e) {



        }


        function dead() {

            var _this = this;
            var tweenR = new TWEEN.Tween(_this.jumpter.position)
                .to({ z: this.jumpterHeight / 2 }, _this.jumpDeadDuration)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(function (obj) {
                    TWEEN.remove(tweenR);

                    _this.isDead = true;
                })
                .start();

        }

        function checkPosition() {

            var jx = this.jumpter.position.x;
            var jy = this.jumpter.position.y;

            var pre = getMeshCentre.call(this, this.currentIndex - 1);

            if (isPointInMeshRect.call(this, jx, jy, pre))
                return 0;

            var current = getMeshCentre.call(this, this.currentIndex);
            if (isPointInMeshRect.call(this, jx, jy, current))
                return 1;

            return -1;
        }

        function isPointInMeshRect(x, y, centre) {

            var part = this.meshSize / 2;
            var partJ = this.jumpterSize / 2;
            if (x + partJ >= centre.x - part && x - partJ <= centre.x + part &&
                y + partJ >= centre.y - part && y - partJ <= centre.y + part)
                return true;

            return false;
        }

        function onMouseMove(e) {

            // e.data.canvas.focus();

            // if (!e.data.isRotateCamera)
            //     return;

            // var x = e.offsetX;
            // var y = e.offsetY;

            // var dx = x - e.data.startPoint.x;
            // var theta = dx * e.data.rotaterate;

            // var current = new THREE.Matrix4();
            // current.makeRotationZ(theta);

            // e.data.selfVisualMatrix = e.data.selfVisualMatrixBackup.clone();
            // e.data.selfVisualMatrix.multiply(current);

            // if (e.data.isRotateByRight) {
            //     e.data.selfMatrix = e.data.selfVisualMatrix.clone();
            // }

            // var dy = y - e.data.startPoint.y;
            // var thetaZ = dy * e.data.rotaterate;

            // var nextThetaZ = e.data.selfThetaZBackup + thetaZ;
            // if (nextThetaZ > 89 * Math.PI / 180)
            //     nextThetaZ = 89 * Math.PI / 180;
            // if (nextThetaZ < -89 * Math.PI / 180)
            //     nextThetaZ = -89 * Math.PI / 180;
            // e.data.selfThetaZ = nextThetaZ;

            // e.preventDefault();
        }

        function onMouseWheel(e, delta) {

            // var length = e.data.cameraLengthTarget.cameraLength - delta * e.data.cameraLengthTarget.cameraLength * e.data.zoomrate;
            // if (length <= 0)
            //     length = 0;

            // e.data.cameraLengthTarget.cameraLength = length;
            // e.data.tweenCamera.start();
        }

        function initCamera() {
            this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 1, 10000);

            this.camera.up.x = 0;
            this.camera.up.y = 0;
            this.camera.up.z = 1;

            var _this = this;
            this.cameraTween = new TWEEN.Tween(this.camera.position)
                .to(this.cameraTarget, this.cameraAnimationDuration)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(function (obj) {
                    // _this.camera.lookAt(_this.cameraCentre.x, _this.cameraCentre.y, _this.cameraCentre.z);
                })
                .start();
            this.cameraCentreTween = new TWEEN.Tween(this.cameraCentre)
                .to(this.cameraCentreTarget, this.cameraAnimationDuration)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(function (obj) {
                    _this.camera.lookAt(_this.cameraCentre.x, _this.cameraCentre.y, _this.cameraCentre.z);
                    _this.transparentMesh.position.x = _this.cameraCentre.x;
                    _this.transparentMesh.position.y = _this.cameraCentre.y;
                })
                .start();
        }

        function initScene() {
            this.scene = new THREE.Scene();
        }

        function initLight() {

            var al = new THREE.AmbientLight(0xa0a0a0);
            this.scene.add(al);

            this.light = new THREE.DirectionalLight(0xffffff, 1);
            this.light.position.set(-200, -350, 2000);
            this.light.castShadow = true;
            this.light.shadow.bias = 0.003;
            this.light.shadow.mapSize.width = 1024;
            this.light.shadow.mapSize.height = 1024;
            this.light.shadow.camera.near = -5;
            this.light.shadow.camera.far = 4024;
            this.light.shadow.camera.left = -1024;
            this.light.shadow.camera.right = 1024;
            this.light.shadow.camera.top = -1024;
            this.light.shadow.camera.bottom = 1024;

            this.scene.add(this.light);
            // this.scene.add(new THREE.CameraHelper(this.light.shadow.camera));

            this.lightTween = new TWEEN.Tween(this.light.position)
                .to(this.lightTarget, this.cameraAnimationDuration)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(function (obj) {
                    // _this.camera.lookAt(_this.cameraCentre.x, _this.cameraCentre.y, _this.cameraCentre.z);
                })
                .start();

            var geometry = new THREE.CubeGeometry(1, 1, 1);
            this.transparentMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ opacity: 0 }));
            this.light.target = this.transparentMesh;
            this.scene.add(this.transparentMesh);
        }

        function initObject() {

            if (!this.enableTexture) {
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(-this.gridSize * this.gridCount / 2, 0, 0));
                geometry.vertices.push(new THREE.Vector3(this.gridSize * this.gridCount / 2, 0, 0));

                for (var i = 0; i <= this.gridCount; i++) {

                    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xd0d0d0, opacity: 0.2 }));
                    line.position.y = (i * this.gridSize) - this.gridSize * this.gridCount / 2;
                    line.position.z = 0.5;
                    this.scene.add(line);

                    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xd0d0d0, opacity: 0.2 }));
                    line.position.x = (i * this.gridSize) - this.gridSize * this.gridCount / 2;
                    line.position.z = 0.5;
                    line.rotation.z = 90 * Math.PI / 180;
                    this.scene.add(line);
                }
            }

            var texture;
            var args;
            if (this.enableTexture) {
                var loader = new THREE.TextureLoader();

                texture = loader.load("views/example-three-jump/image/d-model-stone-floor-texture-pack-vr-ar-lowpoly-obj-fbx-stone-floor-texture.png");
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0, 0);
                texture.repeat.set(500, 500);

                args = {
                    map: texture,
                }
            }
            else {
                args = {
                    color: 0x999999,
                    transparent: true,
                    opacity: 0.5,
                }
            }

            var geometry = new THREE.PlaneGeometry(this.gridSize * this.gridCount, this.gridSize * this.gridCount);
            var material = new THREE.MeshLambertMaterial(args);

            this.plane = new THREE.Mesh(geometry, material);
            this.plane.position.z = -1;
            // this.plane.castShadow = true;
            this.plane.receiveShadow = true;
            this.scene.add(this.plane);





            firstMesh.call(this);
        }

        function dropMetsh(mesh) {

            var _this = this;
            var tween = new TWEEN.Tween(mesh.position)
                .to({ z: this.meshSize / 4 }, this.meshDropAnimationDuration)
                .easing(TWEEN.Easing.Bounce.Out)
                .onComplete(function (obj) {
                    TWEEN.remove(tween);

                    if (!_this.jumpter)
                        initJumpter.call(_this);
                })
                .start();

            updateCamera.call(_this);
        }

        function initJumpter() {

            var geometry = new THREE.CubeGeometry(this.jumpterSize, this.jumpterSize, this.jumpterHeight);

            var m = new THREE.Matrix4();
            m.makeTranslation(0, 0, this.jumpterHeight / 2 + this.jumpterHeight / 2.5);
            var geometry2 = new THREE.SphereGeometry(this.jumpterSize / 1.5, this.jumpterSize, this.jumpterHeight);
            geometry.merge(geometry2, m, 0);


            var args;
            if (this.enableTexture) {
                var loader = new THREE.TextureLoader();

                var texture = loader.load("views/example-three-jump/image/222.jpg");
                // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                // texture.offset.set(0, 0);
                // texture.repeat.set(500, 500);

                args = {
                    map: texture,
                }
            }
            else {
                args = {
                    color: 0x8647ED,
                    // transparent: true,
                    // opacity: 0.5,
                }
            }



            this.jumpter = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(args));
            this.jumpter.name = "jumpter";
            this.jumpter.castShadow = true;
            var vector = getMeshCentre.call(this, 0);

            this.jumpter.position.x = vector.x;
            this.jumpter.position.y = vector.y;
            this.jumpter.position.z = this.initialZ;
            this.jumpter.up.z = 1;
            this.jumpter.up.y = 0;

            this.scene.add(this.jumpter);

            var _this = this;
            var tween = new TWEEN.Tween(this.jumpter.position)
                .to({ z: vector.z + this.jumpterHeight / 2 }, this.meshDropAnimationDuration)
                .easing(TWEEN.Easing.Bounce.Out)
                .onComplete(function (obj) {
                    TWEEN.remove(tween);
                    _this.jumpterReady = true;
                    nextMesh.call(_this);
                })
                .start();

            this.jumpterGeometry = this.jumpter.geometry.clone();

            // var tween = new TWEEN.Tween(this.jumpterScale)
            //     .to(this.jumpterScaleTarget, this.meshDropAnimationDuration)
            //     .easing(TWEEN.Easing.Bounce.Out)
            //     .onComplete(function (obj) {
            //         TWEEN.remove(tween);
            //         _this.jumpterReady = true;
            //         nextMesh.call(_this);
            //     })
            //     .start();

        }

        function firstMesh() {

            var mesh = CreateRandomMesh.call(this);
            mesh.position.z = this.initialZ;

            this.objs.push({ mesh });
            this.currentIndex++;
            this.scene.add(mesh);

            dropMetsh.call(this, mesh);

        }

        function getMeshCentre(index) {

            if (this.objs.length - 1 < index)
                return new THREE.Vector3(0, 0, 0);

            return new THREE.Vector3(this.objs[index].mesh.position.x, this.objs[index].mesh.position.y, this.meshSize / 2);
        }

        function nextMesh() {

            var mesh = CreateRandomMesh.call(this);
            var dm = this.jumpD = GetRandomDm.call(this);
            var distance = GetRandomDistance.call(this);

            var orignal = this.currentIndex >= 0 ?
                new THREE.Vector3(
                    this.objs[this.currentIndex].mesh.position.x,
                    this.objs[this.currentIndex].mesh.position.y,
                    this.objs[this.currentIndex].mesh.position.z) :
                new THREE.Vector3(0, 0, 0);

            orignal[dm] += distance;
            mesh.position.x = orignal.x;
            mesh.position.y = orignal.y;
            mesh.position.z = this.initialZ;

            this.objs.push({ mesh });
            this.currentIndex++;
            this.scene.add(mesh);

            dropMetsh.call(this, mesh);
        }

        function GetRandomDistance() {

            var unit = Math.floor(Math.random() * this.meshSize * this.nextDistanceTimes) + this.meshSize + 1;
            return unit;
        }

        function GetRandomDm() {

            var type = Math.floor(Math.random() * 2);
            return type < 1 ? "x" : "y";
        }

        function CreateRandomMesh() {

            var geometry;
            var mesh;
            var m;
            if (this.enableTexture)
                m = new THREE.MeshLambertMaterial({ map: getRandomTexture.call(this) });
            else
                m = new THREE.MeshLambertMaterial({ color: CreateRandomColor.call(this) });

            var type = Math.floor(Math.random() * 4);
            switch (type) {
                case 0:
                    geometry = new THREE.CubeGeometry(this.meshSize, this.meshSize, this.meshSize / 2);
                    mesh = new THREE.Mesh(geometry, m);
                    break;
                case 1:
                    geometry = new THREE.ConeGeometry(this.meshSize / 2, this.meshSize / 2, this.meshSize / 2);
                    mesh = new THREE.Mesh(geometry, m);
                    mesh.rotation.x = -90 * Math.PI / 180;
                    break;
                case 2:
                    geometry = new THREE.CylinderGeometry(this.meshSize / 2, this.meshSize / 2, this.meshSize / 2, this.meshSize);
                    mesh = new THREE.Mesh(geometry, m);
                    mesh.rotation.x = -90 * Math.PI / 180;
                    break;
                default:
                    geometry = new THREE.CubeGeometry(this.meshSize, this.meshSize, this.meshSize / 2);
                    mesh = new THREE.Mesh(geometry, m);
                    break;
            }


            mesh.up.x = 0;
            mesh.up.y = 0;
            mesh.up.z = 1;
            mesh.castShadow = true;
            mesh.name = this.currentIndex.toString();

            // mesh.receiveShadow = true;
            return mesh;
        }

        function getRandomTexture() {

            var loader = new THREE.TextureLoader();
            var index = Math.floor(Math.random() * this.images.length);
            var texture = loader.load("views/example-three-jump/image/" + this.images[index]);
            // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.offset.set(0, 0);
            // texture.repeat.set(20, 20);


            return texture;
        }

        function CreateRandomColor() {

            var type = Math.floor(Math.random() * 15);
            switch (type) {
                case 0:
                    return 0x3e6db5;
                case 1:
                    return 0x439467;
                case 2:
                    return 0xdc5939;
                case 3:
                    return 0x8653a5;
                case 4:
                    return 0xc75659;
                case 5:
                    return 0x2a93d4;
                case 6:
                    return 0x4c944a;
                case 7:
                    return 0xbd7599;
                case 8:
                    return 0x106ab4;
                case 9:
                    return 0xa3569e;
                case 10:
                    return 0x3e948a;
                case 11:
                    return 0xc94940;
                case 12:
                    return 0xcf721b;
                case 13:
                    return 0xbe33a0;
                default:
                    return 0xFF9025;
                // default:
                //     return (((Math.floor(Math.random() * 255) << 8) + Math.floor(Math.random() * 255)) << 8) + Math.floor(Math.random() * 255);
            }

        }

        function updateCamera() {

            var orignal;

            if (this.currentIndex < 1) {
                orignal = new THREE.Vector3(0, 0, 0);
            }
            else {
                var mesh1 = this.objs[this.currentIndex - 1];
                var mesh2 = this.objs[this.currentIndex];

                orignal = new THREE.Vector3(
                    (mesh2.mesh.position.x + mesh1.mesh.position.x) / 2,
                    (mesh2.mesh.position.y + mesh1.mesh.position.y) / 2,
                    mesh1.mesh.position.z)
            }

            var vector = new THREE.Vector3(0, 1, 0);
            vector.applyMatrix4(this.cameraMatrix);
            vector.setLength(-this.cameraLength);

            this.cameraTarget.x = orignal.x + vector.x;
            this.cameraTarget.y = orignal.y + vector.y;
            this.cameraTarget.z = vector.z;

            this.cameraCentreTarget.x = orignal.x;
            this.cameraCentreTarget.y = orignal.y;
            // this.cameraCentreTarget.z = orignal.z;

            this.cameraTween.start();
            this.cameraCentreTween.start();

            this.lightTarget.x = orignal.x - vector.x;
            this.lightTarget.y = orignal.y + vector.y;
            // this.lightTarget.z = vector.z;
            this.lightTween.start();

        }

        function updateSelf() {

            if (this.isPress && this.jumpter && this.jumpterReady) {
                var current = new Date().getTime();
                var dt = (current - this.jumpterStartTime) * this.jumpScaleRate * this.jumpDescent;
                var dtz = (current - this.jumpterStartTime) * this.jumpScaleRateZ * this.jumpDescent;

                this.jumpDescent /= 1.025;

                // var v = new THREE.Vector3();
                // v.set(this.jumpter.position.x, this.jumpter.position.y, this.jumpter.position.z);
                // var m2 = new THREE.Matrix4();
                // m2.scale(new THREE.Vector3(1, 1, 1 - dt));
                // m2.setPosition(v);

                // this.jumpter.matrix = new THREE.Matrix4();;
                // this.jumpter.updateMatrix();
                // this.jumpter.applyMatrix(m2);
                // this.jumpter.position.set(v.x, v.y, v.z);
                this.jumpter.geometry.translate(0, 0, -this.jumpterHeight * dtz / 2);
                this.jumpter.geometry.scale(1 + dt, 1 + dt, 1 - dtz);
                this.jumpterScaled = true;
                // this.jumpter.updateMatrix();
            }
            else if (!this.isPress && this.jumpter && this.jumpterScaled) {

                // var v = new THREE.Vector3();
                // v.set(this.jumpter.position.x, this.jumpter.position.y, this.jumpter.position.z);
                // var m2 = new THREE.Matrix4();
                // m2.setPosition(v);

                // this.jumpter.matrix = new THREE.Matrix4();

                // this.jumpter.applyMatrix(m2);
                // this.jumpter.position.z = this.meshSize / 4;

                // this.jumpter.updateMatrix();

                this.jumpDescent = 1;

                this.jumpter.geometry = this.jumpterGeometry.clone();
                this.jumpterScaled = false;

                // this.jumpter.matrix.identity();
                // this.jumpter.updateMatrix();
            }

            // var current = new Date().getTime();
            // var vector = new THREE.Vector3();
            // var time;

            // if (this.keysStatus.w && this.keysStatus.w.isPress) {
            //     vector.y += 1;
            //     time = this.keysStatus.w.time;
            //     this.keysStatus.w.time = current;
            // }
            // if (this.keysStatus.s && this.keysStatus.s.isPress) {
            //     vector.y -= 1;
            //     time = this.keysStatus.s.time;
            //     this.keysStatus.s.time = current;
            // }
            // if (this.keysStatus.a && this.keysStatus.a.isPress) {
            //     vector.x -= 1;
            //     time = this.keysStatus.a.time;
            //     this.keysStatus.a.time = current;
            // }
            // if (this.keysStatus.d && this.keysStatus.d.isPress) {
            //     vector.x += 1;
            //     time = this.keysStatus.d.time;
            //     this.keysStatus.d.time = current;
            // }

            // if (!time)
            //     time = current;

            // var length = (current - time) * this.speedrate;

            // vector.applyMatrix4(this.selfMatrix);
            // vector.setLength(length);

            // this.self.position.x += vector.x;
            // this.self.position.y += vector.y;
            // this.self.setRotationFromMatrix(this.selfMatrix);

            // // vector.setLength(-180);

            // var selfVisualMatrixZ = new THREE.Matrix4();
            // selfVisualMatrixZ.makeRotationX(this.selfThetaZ);

            // var distance = new THREE.Vector3(0, 1, 0);
            // distance.applyMatrix4(selfVisualMatrixZ);
            // distance.applyMatrix4(this.selfVisualMatrix);
            // distance.setLength(-this.cameraLength);

            // // var distanceZ = new THREE.Vector3(0, 150, 0);
            // // distanceZ.applyMatrix4(selfVisualMatrixZ);

            // this.camera.position.x = this.self.position.x + distance.x;
            // this.camera.position.y = this.self.position.y + distance.y;
            // this.camera.position.z = distance.z;

            // this.camera.lookAt(this.self.position.x, this.self.position.y, this.self.position.z);
        }

        function render() {
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);

            updateSelf.call(this);

            if (this.isStopPending)
                return;

            requestAnimationFrame(render.bind(this));

            this.stats.update();
            TWEEN.update();
            // _this.jumpGroup.update();
        }

        function threeStart(doc) {
            initThree.call(this, doc);
            initCamera.call(this);
            initScene.call(this);
            initLight.call(this);
            initObject.call(this);
            render.call(this);
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
            this.cameraTween.stop();
            this.cameraCentreTween.stop();
        };

        this.init = function (doc) {
            threeStart.call(this, doc);
        };
    }

    return Shell;
});