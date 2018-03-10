define(["jquery", "vue", "three", "stats", "tween", "animator"], function ($, Vue, THREE, Stats, TWEEN, Animator) {
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
        this.group = null;
        this.plane = null;

        this.starsPoint = null;
        this.skymesh = null;
        this.earth = null;
        this.earthGlow = null;
        this.keyPressPoint = null;
        this.isRotating = false;
        this.isRotatingEarth = false;
        this.rotaterate = 0.01;
        this.zoomrate = 0.1;

        this.rotateArgs = { x: 0, y: 0, z: 0 };
        this.rotateTarget = { x: 0, y: 0, z: 0 };
        this.rotateTween = null;
        this.isRotateComplete = true;

        this.animatorRotate = null;
        this.animatorCamera = null;

        // this.earthMatrix = null;
        // this.earthMatrixZ = null;
        // this.earthThetaZ = null;

        this.raycaster = new THREE.Raycaster();

        this.cameraLength = 400;
        this.cameraLengthMin = 101;
        this.cameraLengthMax = 800;
        this.cameraLengthTarget = { cameraLength: this.cameraLength };

        this.cameraMesh = null;


        this.self = null;

        this.selfCamera = {};
        this.selfMatrix = null;
        this.selfMatrixBackup = null;
        this.selfVisualMatrix = null;
        this.selfVisualMatrixBackup = null;
        // this.selfVisualMatrixZ = null;
        // this.selfVisualMatrixZBackup = null;
        this.keysStatus = [];

        this.tweenCamera = null;

        this.angle = -10;

        this.isRotateCamera = false;
        this.isRotateByRight = false;

        this.speedrate = 0.2;
        this.rotateZrate = -0.001;
        this.jumpHeight = 30;
        this.jumpGroup = null;
        this.jumping = false;


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
            this.renderer.setClearColor(0x000000, 1.0);
            // this.renderer.shadowMap.enabled = true;
            // this.renderer.shadowMap.autoUpdate = true;
            // this.renderer.shadowMap.needsUpdate = true;
            // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

            if (e.data.isRotating)
                return;
            if (e.button !== 2 && e.button !== 0)
                return;

            e.data.isRotating = true;
            e.data.isRotatingEarth = e.button === 0;
            e.data.startPoint = { x: e.offsetX, y: e.offsetY };

            e.preventDefault();
        }

        function onMouseUp(e) {

            if (!e.data.isRotating)
                return;
            if (e.button !== 2 && e.button !== 0)
                return;

            e.data.isRotating = false;
            e.data.startPoint = null;

            e.preventDefault();
        }

        function onMouseMove(e) {

            e.data.canvas.focus();

            if (!e.data.isRotating)
                return;

            if (e.data.isRotatingEarth) {

                var x = e.offsetX;
                var y = e.offsetY;

                // var dx = x - e.data.startPoint.x;
                // var dy = y - e.data.startPoint.y;

                // var theta = dx * e.data.rotaterate * e.data.cameraLength / e.data.cameraLengthMax;
                // var thetaY = dy * e.data.rotaterate * e.data.cameraLength / e.data.cameraLengthMax;

                e.data.raycaster.setFromCamera(new THREE.Vector2((x / e.data.width) * 2 - 1, - (y / e.data.height) * 2 + 1), e.data.camera);
                var intersects1 = e.data.raycaster.intersectObject(e.data.earth);
                e.data.raycaster.setFromCamera(new THREE.Vector2((e.data.startPoint.x / e.data.width) * 2 - 1, - (e.data.startPoint.y / e.data.height) * 2 + 1), e.data.camera);
                var intersects2 = e.data.raycaster.intersectObject(e.data.earth);
                if (intersects1.length > 0 && intersects2.length > 0) {

                    var pt1 = intersects1[0].point;
                    var pt2 = intersects2[0].point;

                    e.data.rotateTarget.x += Math.asin((-pt1.y + pt2.y) / 2 / 100) * 2;
                    e.data.rotateTarget.y += Math.asin((pt1.x - pt2.x) / 2 / 100) * 2;
                }
                else {
                    e.data.raycaster.setFromCamera(new THREE.Vector2((x / e.data.width) * 2 - 1, - (y / e.data.height) * 2 + 1), e.data.camera);
                    var intersects1 = e.data.raycaster.intersectObject(e.data.skymesh);
                    e.data.raycaster.setFromCamera(new THREE.Vector2((e.data.startPoint.x / e.data.width) * 2 - 1, - (e.data.startPoint.y / e.data.height) * 2 + 1), e.data.camera);
                    var intersects2 = e.data.raycaster.intersectObject(e.data.skymesh);

                    var pt1 = intersects1[0].point;
                    var pt2 = intersects2[0].point;

                    e.data.rotateTarget.x += Math.asin((-pt1.y + pt2.y) / 2 / 1600) * 2;
                    e.data.rotateTarget.y += Math.asin((pt1.x - pt2.x) / 2 / 1600) * 2;
                }

                e.data.startPoint.x = x;
                e.data.startPoint.y = y;
            }
            else {

                var x = e.offsetX;
                var y = e.offsetY;

                var dx = x - e.data.startPoint.x;
                var theta = -dx * e.data.rotaterate;

                e.data.startPoint.x = x;
                e.data.startPoint.y = y;

                // e.data.earth.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), theta);
                // e.data.starsPoint.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), theta);

                e.data.rotateTarget.z += theta;
                // console.log(e.data.rotateTarget.z);

            }

            // e.data.rotateTween.stop();

            //  if (e.data.isRotateComplete) {

            e.data.animatorRotate.to(e.data.rotateTarget, 1000);
            // e.data.rotateTween.start();
            //  }

            // var distance = new THREE.Vector3(0, 0, 1);
            // distance.applyMatrix4(e.data.cameraMesh.matrix);
            // distance.setLength(e.data.cameraLength);

            // // var distanceZ = new THREE.Vector3(0, 150, 0);
            // // distanceZ.applyMatrix4(selfVisualMatrixZ);

            // e.data.camera.position.x = distance.x;
            // e.data.camera.position.y = distance.y;
            // e.data.camera.position.z = distance.z;
            // e.data.camera.lookAt(0, 0, 0);



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

            e.preventDefault();
        }

        function onMouseWheel(e, delta) {

            var length = e.data.cameraLengthTarget.cameraLength - delta * e.data.cameraLengthTarget.cameraLength * e.data.zoomrate;
            if (length <= e.data.cameraLengthMin)
                length = e.data.cameraLengthMin;
            if (length >= e.data.cameraLengthMax)
                length = e.data.cameraLengthMax;

            e.data.cameraLengthTarget.cameraLength = length;
            // e.data.tweenCamera.start();

            e.data.animatorCamera.to(e.data.cameraLengthTarget, 1000);
        }

        function initCamera() {
            this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 10000);
            // this.camera.position.x = 0;
            // this.camera.position.y = -350;
            // this.camera.position.z = 50;
            this.camera.up.x = 0;
            this.camera.up.y = 1;
            this.camera.up.z = 0;
            this.camera.position.x = 0;
            this.camera.position.y = 0;
            this.camera.position.z = 400;
            this.camera.lookAt(0, 0, 0);

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


            // this.tweenCamera = new TWEEN.Tween(this)
            //     .to(this.cameraLengthTarget, 500)
            //     .easing(TWEEN.Easing.Quadratic.Out)
            //     // .repeat(Infinity)
            //     .start();

            var _this = this;
            this.animatorCamera = new Animator(this)
                .easing(TWEEN.Easing.Quartic.Out)
                .onUpdate(function (e) {

                    _this.camera.position.z = _this.cameraLength;
                    _this.earthGlow.scale.x = _this.earthGlow.scale.y = _this.earthGlow.scale.z = 1.08 + (400 - _this.cameraLength) * 0.00015;
                });



            // var rx = 0, ry = 0, rz = 0;
            // this.rotateTween = new TWEEN.Tween(this.rotateArgs)
            //     .to(this.rotateTarget, 5000)
            //     .onUpdate(function (e) {

            //         _this.isRotateComplete = false;
            //         _this.earth.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), _this.rotateArgs.x - rx);
            //         _this.earth.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), _this.rotateArgs.y - ry);
            //         _this.earth.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), _this.rotateArgs.z - rz);

            //         _this.earthSmoke.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), _this.rotateArgs.y - ry);
            //         _this.earthSmoke.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), _this.rotateArgs.x - rx);
            //         _this.earthSmoke.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), _this.rotateArgs.z - rz);

            //         _this.starsPoint.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), _this.rotateArgs.x - rx);
            //         _this.starsPoint.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), _this.rotateArgs.y - ry);
            //         _this.starsPoint.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), _this.rotateArgs.z - rz);


            //         rx = _this.rotateArgs.x;
            //         ry = _this.rotateArgs.y;
            //         rz = _this.rotateArgs.z;
            //     })
            //     .onComplete(function (e) {
            //         _this.isRotateComplete = true;
            //     })
            //     // .repeat(Infinity)
            //     .start();


            this.animatorRotate = new Animator(this.rotateArgs)
                .easing(TWEEN.Easing.Quartic.Out)
                .onUpdate(function (e) {

                    _this.earth.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), e.x);
                    _this.earth.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), e.y);
                    _this.earth.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), e.z);

                    _this.starsPoint.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), e.x);
                    _this.starsPoint.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), e.y);
                    _this.starsPoint.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), e.z);

                });

            // t0.chain(t1);
            // t1.chain(t2);
            // t2.chain(t3);
            // t3.chain(t0);

            // this.selfCamera.x = 0;
            // this.selfCamera.y = -150;
            // this.selfCamera.z = 50;

            // this.selfMatrix = new THREE.Matrix4();
            // this.selfVisualMatrix = new THREE.Matrix4();
            // this.selfVisualMatrixZ = new THREE.Matrix4();
            // this.selfThetaZ = -30 * Math.PI / 180;
            // this.selfVisualMatrixZ.makeRotationX(30 * Math.PI / 180);

        }

        function initScene() {
            this.scene = new THREE.Scene();
            // var bgTexture = new THREE.TextureLoader().load("views/example-three-earth/image/stars.jpg");
            // bgTexture.wrapS = bgTexture.wrapT = THREE.RepeatWrapping;
            // bgTexture.offset.set(0, 0);
            // bgTexture.repeat.set(500, 500);
            // this.scene.background = bgTexture;

            this.group = new THREE.Group();
            this.scene.add(this.group);
        }

        function initLight() {


            var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
            hemisphereLight.position.x = 0;
            hemisphereLight.position.y = 0;
            hemisphereLight.position.z = 400;
            this.scene.add(hemisphereLight);

            // var al = new THREE.AmbientLight(0xa0a0a0);
            // // al.castShadow = true;
            // this.scene.add(al);

            // this.light = new THREE.DirectionalLight(0xffffff, 1);
            // this.light.position.set(100, 120, 1000);
            // this.light.castShadow = true;
            // this.light.shadow.mapSize.width = 1024;
            // this.light.shadow.mapSize.height = 1024;
            // this.light.shadow.camera.near = -1024;
            // this.light.shadow.camera.far = 2096;
            // // this.light.shadow.radius = 1;
            // this.light.shadow.camera.left = -1024;
            // this.light.shadow.camera.right = 1024;
            // this.light.shadow.camera.top = -1024;
            // this.light.shadow.camera.bottom = 1024;


            // this.scene.add(this.light);
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

            var _this = this;


            var starsGeometry = new THREE.Geometry();
            for (var i = 0; i < 5000; i++) {
                var starVector = new THREE.Vector3(
                    THREE.Math.randFloatSpread(2000),
                    THREE.Math.randFloatSpread(2000),
                    THREE.Math.randFloatSpread(2000)
                );

                starVector.setLength(Math.random() * 2000 + 800);
                starsGeometry.vertices.push(starVector);
            }
            var starsMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 8 })
            this.starsPoint = new THREE.Points(starsGeometry, starsMaterial);
            _this.group.add(this.starsPoint);





            var skyGeometry = new THREE.SphereGeometry(5000, 100, 100);
            var skyMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.BackSide });
            this.skymesh = new THREE.Mesh(skyGeometry, skyMaterial);
            _this.group.add(this.skymesh);






            var customMaterialAtmosphere = new THREE.ShaderMaterial({
                uniforms: {
                    "c": {
                        type: "f",
                        value: 0.5
                    },
                    "p": {
                        type: "f",
                        value: 4.0
                    }
                },
                vertexShader: document.getElementById('vertexShaderAtmosphere').textContent,
                fragmentShader: document.getElementById('fragmentShaderAtmosphere').textContent
            });

            var sphereGeo = new THREE.SphereGeometry(100, 100, 100);

            var mesh = new THREE.Mesh(sphereGeo.clone(), customMaterialAtmosphere);
            // atmosphere should provide light from behind the sphere, so only render the back side
            mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.08;
            mesh.material.side = THREE.BackSide;
            _this.group.add(mesh);
            this.earthGlow = mesh;

            // clone earlier sphere geometry to block light correctly
            // and make it a bit smaller so that light blends into surface a bit
            // var blackMaterial = new THREE.MeshBasicMaterial({
            //     color: 0x000000
            // });
            // var sphere = new THREE.Mesh(sphereGeo.clone(), blackMaterial);
            // sphere.scale.x = sphere.scale.y = sphere.scale.z = 1;
            // _this.group.add(sphere);









            var globeTextureLoader = new THREE.TextureLoader();
            var texture = globeTextureLoader.load('views/example-three-earth/image/1_earth_8k.jpg');
            var globeGgeometry = new THREE.SphereGeometry(100, 100, 100);
            var globeMaterial = new THREE.MeshStandardMaterial({ map: texture });
            var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            _this.group.add(globeMesh);
            _this.earth = globeMesh;



            // var texture = globeTextureLoader.load('views/example-three-earth/image/earth_clouds_low_4096.jpg');
            // var globeGgeometry = new THREE.SphereGeometry(105, 105, 105);
            // var globeMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true, opacity: .5 });
            // var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            // _this.group.add(globeMesh);
            // _this.earthSmoke = globeMesh;



            // var texture = globeTextureLoader.load('views/example-three-earth/image/1_earth_8k.jpg');
            // var cameraGeometry = new THREE.SphereGeometry(10, 10, 10);
            // var cameraMaterial = new THREE.MeshStandardMaterial({ map: texture });
            // this.cameraMesh = new THREE.Mesh(cameraGeometry, cameraMaterial);
            // _this.group.add(this.cameraMesh);

            // var globeGgeometry = new THREE.SphereGeometry(102, 102, 102);
            // var globeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 0.1, transparent: true });
            // var shell = new THREE.Mesh(globeGgeometry, globeMaterial);
            // _this.group.add(shell);

            // this.earthMatrix = new THREE.Matrix4();
            // this.earthMatrixZ = new THREE.Matrix4();


            // var geometry = new THREE.Geometry();
            // geometry.vertices.push(new THREE.Vector3(-this.gridSize * this.gridCount / 2, 0, 0));
            // geometry.vertices.push(new THREE.Vector3(this.gridSize * this.gridCount / 2, 0, 0));

            // for (var i = 0; i <= this.gridCount; i++) {

            //     var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xcccccc, opacity: 0.2 }));
            //     line.position.y = (i * this.gridSize) - this.gridSize * this.gridCount / 2;
            //     this.scene.add(line);

            //     var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xcccccc, opacity: 0.2 }));
            //     line.position.x = (i * this.gridSize) - this.gridSize * this.gridCount / 2;
            //     line.rotation.z = 90 * Math.PI / 180;
            //     this.scene.add(line);
            // }

            // var geometry = new THREE.CubeGeometry(10, 40, 10);
            // var material = new THREE.MeshLambertMaterial({ color: 0xFF9025 });

            // this.self = new THREE.Mesh(geometry, material);
            // this.self.position.x = 0;
            // this.self.position.y = 0;
            // this.self.position.z = 5.01;
            // this.self.castShadow = true;
            // // this.self.receiveShadow = true;
            // // this.self.rotation.z = this.angle * Math.PI / 180;

            // this.scene.add(this.self);

            // this.light.target = this.self;

            // var geometry = new THREE.PlaneGeometry(this.gridSize * this.gridCount, this.gridSize * this.gridCount);
            // var material = new THREE.MeshLambertMaterial({
            //     side: THREE.DoubleSide,
            //     color: 0xaaaaaa,
            //     transparent: true,
            //     opacity: 0.5,
            // });

            // this.plane = new THREE.Mesh(geometry, material);
            // this.plane.position.z = 0;
            // this.plane.receiveShadow = true;
            // this.scene.add(this.plane);



            // var frontMainCoords = [
            //     [-80, -30], [-80, 20], [50, 20], [50, 0], [20, -30], [-80, -30]
            // ];
            // var frontMainCoordsHole = [
            //     [-70, -20], [-70, 10], [40, 10], [40, 0], [10, -20], [-70, -20]
            // ];
            // var frontMainShape = makeShape(frontMainCoords, frontMainCoordsHole);
            // var frontMainGeometry = makeExtrudeGeometry(frontMainShape, 10);


            // var material = new THREE.MeshLambertMaterial({ color: 0xFF9025, side: THREE.DoubleSide, });

            // var mesh = new THREE.Mesh(frontMainGeometry, material);
            // mesh.castShadow = true;

            // this.scene.add(mesh);
        }


        function updateSelf() {

            // var current = new Date().getTime();
            // var vector = new THREE.Vector3();
            // var time;

            // this.earth.setRotationFromMatrix(this.earthMatrix);

            // // vector.setLength(-180);

            // var selfVisualMatrixZ = new THREE.Matrix4();
            // selfVisualMatrixZ.makeRotationX(this.selfThetaZ);

            // var distance = new THREE.Vector3(0, 0, 1);
            // distance.applyMatrix4(this.earthMatrixZ);
            // distance.applyMatrix4(this.earthMatrix);
            // distance.setLength(-this.cameraLength);

            // // var distanceZ = new THREE.Vector3(0, 150, 0);
            // // distanceZ.applyMatrix4(selfVisualMatrixZ);

            // this.camera.position.x = distance.x;
            // this.camera.position.z = this.cameraLength;
            // this.camera.position.z = distance.z;

            // this.light.position.x = this.self.position.x + 300;
            // this.light.position.y = this.self.position.y + 400;

            // this.light.shadow.camera.left = this.light.position.x - 1024;
            // this.light.shadow.camera.right = this.light.position.x + 1024;
            // this.light.shadow.camera.top = this.light.position.y - 1024;
            // this.light.shadow.camera.bottom = this.light.position.y + 1024;

            // this.light.camera.lookAt(this.self.position.x, this.self.position.y, this.self.position.z);
            // this.camera.lookAt(0, 0, 0);
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
            _this.animatorRotate.update();
            _this.animatorCamera.update();
            // _this.jumpGroup.update();
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
            // this.tweenCamera.stop();
        };

        this.init = function (doc) {
            threeStart.call(this, doc);
        };
    }

    return Shell;
});