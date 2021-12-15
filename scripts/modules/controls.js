import { fadeOut } from "./shader.js";

export function keyboardControls(scene, domes, xr) {
  scene.onKeyboardObservable.add((kbInfo) => {
    if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
      switch (kbInfo.event.code) {
        case "Space":
          fadeOut(1, scene, domes);
          break;
        case "Backspace":
          fadeOut(-1, scene, domes);
          break;
        case "KeyM":
          window.music.isPlaying ? window.music.pause() : window.music.play();
          break;
        case "KeyR":
          fadeOut(0, scene, domes);
          break;
        case "KeyX":
          console.log(xr);
          xr.baseExperience.enterXRAsync("immersive-vr", "local-floor");
          break;
      }
    }
  });
}

export function vrControls(xr, scene, domes) {
  let trigger,
    button,
    squeeze,
    touchpad = false;
  xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      const xr_ids = motionController.getComponentIds();
      xr_ids.forEach((id) => {
        let component = motionController.getComponent(id);
        switch (component.type) {
          case "trigger":
            if (!trigger) {
              trigger = true;
              component.onButtonStateChangedObservable.add(() => {
                if (component.pressed) fadeOut(1, scene, domes);
              });
            }
            break;
          case "touchpad" || "thumbstick":
            if (!touchpad) {
              touchpad = true;
              component.onButtonStateChangedObservable.add(() => {
                if (component.pressed)
                  window.music.isPlaying
                    ? window.music.pause()
                    : window.music.play();
              });
            }
            break;
          case "button":
            if (!button) {
              button = true;
              component.onButtonStateChangedObservable.add(() => {
                if (component.pressed) fadeOut(-1, scene, domes);
              });
            }
            break;
          case "squeeze":
            if (!squeeze) {
              squeeze = true;
              component.onButtonStateChangedObservable.add(() => {
                if (component.pressed) fadeOut(0, scene, domes);
              });
            }
            break;
          default:
            break;
        }
        //   if (component.type === "trigger") {
        //     component.onButtonStateChangedObservable.add(() => {
        //       if (component.pressed) fadeOut("forward", scene, domes);
        //     });
        //   } else {
        //   }
        // });
        // let triggerComponent = motionController.getComponent(xr_ids[0]);
        // let squeezeComponent = motionController.getComponent(xr_ids[1]);
        // let button1Component = motionController.getComponent(xr_ids[3]);
        // let button2Component = motionController.getComponent(xr_ids[4]);
        // console.log(xr_ids);
        // triggerComponent.onButtonStateChangedObservable.add(() => {
        //   if (triggerComponent.pressed) {
        //     fadeOut("forward", scene, domes);
        //   }
        // });
        // button1Component.onButtonStateChangedObservable.add(() => {
        //   if (button1Component.pressed) {
        //     fadeOut("back", scene, domes);
        //   }
        // });
        // button2Component.onButtonStateChangedObservable.add(() => {
        //   if (button2Component.pressed) {
        //     fadeOut("reset", scene, domes);
        //   }
        // });
        // squeezeComponent.onButtonStateChangedObservable.add(() => {
        //   if (squeezeComponent.pressed) {
        //     window.music.isPlaying ? window.music.pause() : window.music.play();
        //   }
        // });
      });
    });
  });
  // console.log(xr);
}
