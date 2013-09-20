COMPONENTS.directive('webGlAppView', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'webGlAppView.html',
        scope: {
            onResized : '='
        },
        link: function link(scope, element) {

            var camera, scene, renderer, componentPath = '/client/apps/webGlApp/';

            scope.onResized = function () {
                var SCREEN_WIDTH = element.width(), SCREEN_HEIGHT = element.width() * 0.5;
                renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
                camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
                camera.updateProjectionMatrix();
            };

            function display() {

                //noinspection JSHint
                if (!Detector.webgl) { Detector.addGetWebGLMessage(); }

                var statsEnabled = true, container, stats, loader, mesh,
                    directionalLight, directionalLight2, pointLight, ambientLight, spotLight,
                    mouseX = 0, mouseY = 0, targetX = 0, targetY = 0,
                    windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2,
                    firstPass = true, composerBeckmann;

                function init() {

                    var color, effectBeckmann, effectCopy, pars, rtwidth = 512, rtheight = 512;

                    container = document.createElement('div');
                    element.append(container);

                    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 10000);
                    camera.position.z = 1200;
                    scene = new THREE.Scene();

                    // LIGHTS
                    ambientLight = new THREE.AmbientLight(0x555555);
                    scene.add(ambientLight);

                    pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);
                    pointLight.position.set(0, 0, 600);
                    scene.add(pointLight);

                    // shadow for PointLight
                    spotLight = new THREE.SpotLight(0xffffff, 1);
                    spotLight.position.set(0.05, 0.05, 1);
                    scene.add(spotLight);

                    spotLight.position.multiplyScalar(700);

                    spotLight.castShadow = true;
                    spotLight.onlyShadow = true;
                    //spotLight.shadowCameraVisible = true;

                    spotLight.shadowMapWidth = 2048;
                    spotLight.shadowMapHeight = 2048;

                    spotLight.shadowCameraNear = 200;
                    spotLight.shadowCameraFar = 1500;

                    spotLight.shadowCameraFov = 40;

                    spotLight.shadowBias = -0.005;
                    spotLight.shadowDarkness = 0.15;

                    directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
                    directionalLight.position.set(1, -0.5, 1);
                    directionalLight.color.setHSL(0.6, 1, 0.85);
                    scene.add(directionalLight);

                    directionalLight.position.multiplyScalar(500);

                    directionalLight.castShadow = true;
                    //directionalLight.shadowCameraVisible = true;

                    directionalLight.shadowMapWidth = 2048;
                    directionalLight.shadowMapHeight = 2048;

                    directionalLight.shadowCameraNear = 200;
                    directionalLight.shadowCameraFar = 1500;

                    directionalLight.shadowCameraLeft = -500;
                    directionalLight.shadowCameraRight = 500;
                    directionalLight.shadowCameraTop = 500;
                    directionalLight.shadowCameraBottom = -500;

                    directionalLight.shadowBias = -0.005;
                    directionalLight.shadowDarkness = 0.15;

                    directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.85);
                    directionalLight2.position.set(1, -0.5, -1);
                    scene.add(directionalLight2);

                    loader = new THREE.JSONLoader(true);
                    element.append(loader.statusDomElement);

                    loader.load(componentPath + "obj/leeperrysmith/LeePerrySmith.js", function (geometry) {
                        createScene(geometry, 100)
                    });

                    renderer = new THREE.WebGLRenderer({ antialias: false, clearColor: 0x060708, clearAlpha: 1, alpha: false });
                    renderer.setSize(element.width() - 10, element.width() * 0.5);
                    container.appendChild(renderer.domElement);

                    color = new THREE.Color();
                    color.setHSL(0.6, 0.1, 0.3);
                    renderer.setClearColor(color, 1);

                    renderer.shadowMapEnabled = true;
                    renderer.shadowMapCullFace = THREE.CullFaceBack;

                    renderer.autoClear = false;

                    renderer.gammaInput = true;
                    renderer.gammaOutput = true;
                    renderer.physicallyBasedShading = true;

                    if (statsEnabled) {
                        stats = new Stats();
                        container.appendChild(stats.domElement);
                    }

                    // COMPOSER
                    renderer.autoClear = false;

                    // BECKMANN
                    effectBeckmann = new THREE.ShaderPass(THREE.ShaderSkin["beckmann"]);
                    effectCopy = new THREE.ShaderPass(THREE.CopyShader);

                    effectCopy.renderToScreen = true;

                    pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };

                    composerBeckmann = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(rtwidth, rtheight, pars));
                    composerBeckmann.addPass(effectBeckmann);
                    composerBeckmann.addPass(effectCopy);

                    // EVENTS
                    document.addEventListener('mousemove', onDocumentMouseMove, false);
                }

                function createScene(geometry, scale) {

                    var mapHeight, mapSpecular, mapColor, shader, fragmentShader, vertexShader, uniforms, material;

                    mapHeight = THREE.ImageUtils.loadTexture(componentPath + "obj/leeperrysmith/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg");

                    mapHeight.anisotropy = 4;
                    mapHeight.repeat.set(0.998, 0.998);
                    mapHeight.offset.set(0.001, 0.001);
                    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
                    mapHeight.format = THREE.RGBFormat;

                    mapSpecular = THREE.ImageUtils.loadTexture(componentPath + "obj/leeperrysmith/Map-SPEC.jpg");

                    mapSpecular.anisotropy = 4;
                    mapSpecular.repeat.set(0.998, 0.998);
                    mapSpecular.offset.set(0.001, 0.001);
                    mapSpecular.wrapS = mapSpecular.wrapT = THREE.RepeatWrapping;
                    mapSpecular.format = THREE.RGBFormat;

                    mapColor = THREE.ImageUtils.loadTexture(componentPath + "obj/leeperrysmith/Map-COL.jpg");

                    mapColor.anisotropy = 4;
                    mapColor.repeat.set(0.998, 0.998);
                    mapColor.offset.set(0.001, 0.001);
                    mapColor.wrapS = mapColor.wrapT = THREE.RepeatWrapping;
                    mapColor.format = THREE.RGBFormat;

                    shader = THREE.ShaderSkin["skinSimple"];

                    fragmentShader = shader.fragmentShader;
                    vertexShader = shader.vertexShader;

                    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

                    uniforms["enableBump"].value = true;
                    uniforms["enableSpecular"].value = true;

                    uniforms["tBeckmann"].value = composerBeckmann.renderTarget1;
                    uniforms["tDiffuse"].value = mapColor;

                    uniforms["bumpMap"].value = mapHeight;
                    uniforms["specularMap"].value = mapSpecular;

                    uniforms["uAmbientColor"].value.setHex(0xa0a0a0);
                    uniforms["uDiffuseColor"].value.setHex(0xa0a0a0);
                    uniforms["uSpecularColor"].value.setHex(0xa0a0a0);

                    uniforms["uRoughness"].value = 0.145;
                    uniforms["uSpecularBrightness"].value = 0.75;

                    uniforms["bumpScale"].value = 16;

                    uniforms["offsetRepeat"].value.set(0.001, 0.001, 0.998, 0.998);

                    material = new THREE.ShaderMaterial({ fragmentShader: fragmentShader, vertexShader: vertexShader, uniforms: uniforms, lights: true });

                    mesh = new THREE.Mesh(geometry, material);

                    mesh.position.y = - 50;
                    mesh.scale.set(scale, scale, scale);

                    mesh.castShadow = true;
                    mesh.receiveShadow = true;

                    scene.add(mesh);

                    loader.statusDomElement.style.display = "none";
                }

                function onDocumentMouseMove(event) {
                    mouseX = (event.clientX - windowHalfX);
                    mouseY = (event.clientY - windowHalfY);
                }

                function animate() {
                    requestAnimationFrame(animate);
                    render();
                    if (statsEnabled) { stats.update(); }
                }

                function render() {

                    targetX = mouseX * 0.001;
                    targetY = mouseY * 0.001;

                    if (mesh) {
                        mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
                        mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
                    }

                    if (firstPass) {
                        composerBeckmann.render();
                        firstPass = false;
                    }

                    renderer.clear();
                    renderer.render(scene, camera);
                }

                init();
                animate();
            }

            yepnope({
                load: [
                    componentPath + 'lib/three.min.js',
                    componentPath + 'js/ShaderSkin.js',
                    componentPath + 'js/shaders/CopyShader.js',
                    componentPath + 'js/postprocessing/EffectComposer.js',
                    componentPath + 'js/postprocessing/RenderPass.js',
                    componentPath + 'js/postprocessing/ShaderPass.js',
                    componentPath + 'js/postprocessing/MaskPass.js',
                    componentPath + 'js/Detector.js',
                    componentPath + 'js/stats.min.js'
                ],
                complete: function () {
                    setTimeout(function () { //Display in a new thread to avoid problem with the size of the canvas
                        display();
                    }, 1000)

                }
            });
        }
    };
});

COMPONENTS.directive('webGlAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        scope: {},
        templateUrl: 'webGlAppEdit.html'
    };
});