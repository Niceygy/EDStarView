import * as THREE from "three";
import { App } from "locar";

export const isDebugMode = window.location.href.includes("localhost") || window.location.href.includes("devtunnels.ms");
///^Distance systems sit from the camera. Because space is too big...

export let initialNorth: number = 0;
export function setNorth(n: number) {
  initialNorth = n;
}
//^only load north once

export const skyDomeGroup = new THREE.Group();

export const HiddenCanvas: HTMLCanvasElement = document.getElementById("hidden-canvas") as HTMLCanvasElement;

export const isGPSAllowed = window.location.href.includes("allow-gps=false");

export const app = new App({
  cameraOptions: { hFov: 80, near: 0.001, far: 1000 },
  canvas: document.getElementById("glscene") as HTMLCanvasElement,
  deviceOrientationOptions: { enabled: false },
});
