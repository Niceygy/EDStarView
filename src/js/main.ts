import * as THREE from "three";

import { Star, debugDot } from "./star";
import { isDebugMode, skyDomeGroup, app, isGPSAllowed } from "./constants";

function loadSystems(): Star[] {
  return [new Star("Sagittarius A*", [25.21, -20.9, 25899.68]), new Star("Colonia", [-953.12, -910.28, 19808.12])];
}

try {
  const LocalAR = await app.start();
  const nativeScene = app.scene;
  const systems = loadSystems();

  app.camera.add(skyDomeGroup);
  app.scene.add(app.camera);

  if (isDebugMode) app.camera.add(debugDot());

  //Make the thing the systems sit on. I think
  const geometry = new THREE.SphereGeometry(40, 32, 32);

  for (const sys of systems) {
    if (sys.rawCoords[0] === 0 && sys.rawCoords[1] === 0 && sys.rawCoords[2] === 0) continue;
    //^ignore broken ones and sol

    const meshMaterial = new THREE.MeshBasicMaterial({
      color: sys.colour,
      visible: true,
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

  if (isGPSAllowed) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
        LocalAR.fakeGps(pos.coords.longitude, pos.coords.latitude, pos.coords.accuracy);
      });
    }
  }
} catch (e: any) {
  console.log(e);
  alert(e);
}
