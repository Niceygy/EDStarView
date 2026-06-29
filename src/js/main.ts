import * as THREE from "three";
import { Star, debugDot } from "./star";
import { isDebugMode, skyDomeGroup, app, isGPSAllowed } from "./constants";
import { createStarImage } from "./canvas";

function loadSystems(): Star[] {
  return [new Star("Sagittarius A*", [25.21, -20.9, 25899.68]), new Star("Colonia", [-953.12, -910.28, 19808.12])];
}

try {
  const LocalAR = await app.start();
  const systems = loadSystems();

  // Protect the skyDomeGroup by nesting it onto the camera hierarchy
  app.camera.add(skyDomeGroup);
  app.scene.add(app.camera);

  if (isDebugMode) app.camera.add(debugDot());

  // Loop over every system coordinate set
  for (const sys of systems) {
    if (sys.rawCoords[0] === 0 && sys.rawCoords[1] === 0 && sys.rawCoords[2] === 0) continue; // Skip bad setups

    // 1. Build an un-attached canvas asset for this specific star
    const starCanvas = createStarImage(sys);

    // 2. Map the isolated transparent asset to the WebGL texture frame pipeline
    const canvasTexture = new THREE.CanvasTexture(starCanvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: canvasTexture,
      transparent: true, // Tells Three.js to render alpha transparency holes
    });

    // 3. Initialize a 2D Sprite plane so the canvas image always looks flatly at you
    const starSprite = new THREE.Sprite(spriteMaterial);
    starSprite.scale.set(40, 40, 1); // Set size scaling dimensions
    starSprite.position.copy(sys.positionToRenderAt); // Copy over mapped coordinates

    // Append the sprite safely onto our responsive gyro layer group
    skyDomeGroup.add(starSprite);
  }

  // Freeze the camera transform attributes to allow our custom math matrix to dictate position
  app.camera.position.set(0, 0, 0);
  app.camera.static = true;

  LocalAR.on("gpserror", (error: GeolocationPositionError) => {
    console.error(`GPS Error: ${error.code}`);
  });

  // 4. CRUCIAL STEP: Fire up LocAR's GPS video camera capture process immediately
  LocalAR.startGps();

  // 5. Handle fallback orientation or mock positioning parameters safely afterward
  if (isGPSAllowed) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
        LocalAR.fakeGps(pos.coords.longitude, pos.coords.latitude, pos.coords.accuracy);
      });
    }
  } else {
    LocalAR.fakeGps(0, 0); // Safe to invoke mock variables now that the stream pipeline has explicitly loaded
  }
} catch (e: any) {
  console.log(e);
  alert(e);
}
