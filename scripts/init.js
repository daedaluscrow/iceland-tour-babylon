import { data } from "./data.js";
import { createShader } from "./modules/shader.js";
import { createLoadingScreen } from "./modules/loadingScreen.js";
import { keyboardControls, vrControls } from "./modules/controls.js";
import { loadAssets } from "./modules/assets.js";
import { initDomes } from "./modules/initDomes.js";

let canvas = document.getElementById("renderCanvas");
let engine = null;
let scene = null;
let sceneToRender = null;

createLoadingScreen();

let createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};

let createScene = async function () {
  window.engine.displayLoadingUI();
  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;
  let scene = new BABYLON.Scene(engine);
  let camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );

  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  let light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;

  let domes = initDomes(data, scene);

  loadAssets(scene);

  createShader(camera);

  const env = scene.createDefaultEnvironment();

  const xr = await scene.createDefaultXRExperienceAsync({
    // floorMeshes: [env.ground],
    disableTeleportation: true,
    uiOptions: {
      onError: (error) => {
        console.log(error);
      },
    },
  });

  keyboardControls(scene, domes, xr);
  vrControls(xr, scene, domes);

  return scene;
};

window.initFunction = async function () {
  let asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!window.engine) throw "engine should not be null.";
  window.scene = createScene();
};

window.initFunction().then(() => {
  window.scene.then((returnedScene) => {
    sceneToRender = returnedScene;
  });

  window.engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function () {
  window.engine.resize();
});
