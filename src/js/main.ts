import * as THREE from "three";
import { App, GpsReceivedEvent } from "locar";

///Distance systems sit from the camera. Because space is too big...
const DomeRadius: number = 400;
let initialNorth: number = 0;
//^only load north once
const skyDomeGroup = new THREE.Group();

class Star {
  systemName: string;
  positionToRenderAt: THREE.Vector3;
  rawCoords: number[];
  public constructor(n: string, coords: number[]) {
    this.systemName = n;
    this.rawCoords = coords;
    this.positionToRenderAt = new THREE.Vector3(coords[0], coords[1], coords[2]);
    this.positionToRenderAt = this.positionToRenderAt.normalize();
    this.positionToRenderAt = this.positionToRenderAt.multiplyScalar(DomeRadius);
    this.positionToRenderAt = new THREE.Vector3(this.positionToRenderAt.x, this.positionToRenderAt.y, -this.positionToRenderAt.z);
  }
}

const app = new App({
  cameraOptions: { hFov: 80, near: 0.001, far: 1000 },
  canvas: document.getElementById("glscene") as HTMLCanvasElement,
  deviceOrientationOptions: { enabled: false },
});

function loadSystems(): Star[] {
  return [new Star("Sagittarius A*", [25.21, -20.9, 25899.68]), new Star("Colonia", [-953.12, -910.28, 19808.12])];
}

function makeRandomColour(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

try {
  const LocalAR = await app.start();
  const nativeScene = app.scene;
  const systems = loadSystems();

  app.camera.add(skyDomeGroup);
  //app.scene.add(app.camera);

  //Make the thing the systems sit on. I think
  const geometry = new THREE.SphereGeometry(40, 32, 32);

  for (const sys of systems) {
    if (sys.rawCoords[0] === 0 && sys.rawCoords[1] === 0 && sys.rawCoords[2] === 0) continue;
    //^ignore broken ones and sol

    const meshMaterial = new THREE.MeshBasicMaterial({
      color: makeRandomColour(),
      wireframe: false,
    });
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.position.copy(sys.positionToRenderAt);

    // nativeScene.add(mesh);
    skyDomeGroup.add(mesh);
  }

  //disable auto camera things
  app.camera.position.set(0, 0, 0);
  app.camera.static = true;

  LocalAR.on("gpserror", (error: GeolocationPositionError) => {
    console.error(`GPS Error: ${error.code}`);
  });

  //   LocalAR.startGps();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
      LocalAR.fakeGps(pos.coords.longitude, pos.coords.latitude, pos.coords.accuracy);
    });
  }
} catch (e: any) {
  console.log(e);
  alert(e);
}

function getInitialHeading(event: DeviceOrientationEvent) {
  if (event.alpha !== null) {
    initialNorth = event.alpha;

    //remove listener
    window.removeEventListener("deviceorientationabsolute", getInitialHeading, true);

    startSmoothGryoTracking(initialNorth);
  }
}

window.addEventListener("deviceorientationabsolute", getInitialHeading, true);

function startSmoothGryoTracking(offset: number) {
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
