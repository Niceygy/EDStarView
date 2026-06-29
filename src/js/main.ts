import * as THREE from "three";
import { App } from "locar";

const app = new App({
  cameraOptions: { hFov: 80, near: 0.001, far: 1000 },
});

let fakeGPSCoords: number[] = [];

function createBox(): THREE.Mesh {
  const geom = new THREE.BoxGeometry(10, 10, 10);
  var image = document.createElement("img");
  image.src = "assets/orbis.png";
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, map: new THREE.Texture(image) });
  const mesh = new THREE.Mesh(geom, material);
  return mesh;
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    async (pos: GeolocationPosition) => {
      fakeGPSCoords = [pos.coords.longitude, pos.coords.latitude];
      alert(fakeGPSCoords);
      try {
        const locar = await app.start();
        locar.fakeGps(fakeGPSCoords[0], fakeGPSCoords[1]);

        locar.add(createBox(), fakeGPSCoords[0], fakeGPSCoords[1] - 0.0005);
        locar.add(createBox(), fakeGPSCoords[0], fakeGPSCoords[1] + 0.0005);
        locar.add(createBox(), fakeGPSCoords[0] - 0.0005, fakeGPSCoords[1]);
        locar.add(createBox(), fakeGPSCoords[0] + 0.0005, fakeGPSCoords[1]);
      } catch (e: any) {
        alert(`Error: ${e.code} ${e.message}`);
      }
    },
    (e: GeolocationPositionError) => {
      alert(e);
    },
  );
}
