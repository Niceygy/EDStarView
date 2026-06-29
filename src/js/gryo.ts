import * as THREE from "three";
import { setNorth, skyDomeGroup, initialNorth, app } from "./constants";

export function getInitialHeading(event: DeviceOrientationEvent) {
  if (event.alpha !== null) {
    setNorth(event.alpha);

    //remove listener
    window.removeEventListener("deviceorientationabsolute", getInitialHeading, true);

    startSmoothGryoTracking(initialNorth);
  }
}

window.addEventListener("deviceorientationabsolute", getInitialHeading, true);

export function startSmoothGryoTracking(offset: number) {
  window.addEventListener("deviceorientation", (event: DeviceOrientationEvent) => {
    let pitch = event.beta || 0;
    let roll = event.gamma || 0;
    let curentAlpha = event.alpha || 0;

    //^default to 0

    //maths!
    const smoothYaw = curentAlpha - offset;
    const euler = new THREE.Euler(pitch * (Math.PI / 180), smoothYaw * (Math.PI / 180), -roll * (Math.PI / 180), "ZXY");
    const targetQuaternion = new THREE.Quaternion().setFromEuler(euler).invert();
    skyDomeGroup.quaternion.slerp(targetQuaternion, 0.2);
    app.camera.position.set(0, 0, 0);
    //'slerp' xD
  });
}
