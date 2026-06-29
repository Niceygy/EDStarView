import * as THREE from "three";

const DomeRadius: number = 400;

export class Star {
  systemName: string;
  positionToRenderAt: THREE.Vector3;
  rawCoords: number[];
  colour: string;
  public constructor(n: string, coords: number[]) {
    this.systemName = n;
    this.rawCoords = coords;
    this.positionToRenderAt = new THREE.Vector3(coords[0], coords[1], coords[2]);
    this.positionToRenderAt = this.positionToRenderAt.normalize();
    this.positionToRenderAt = this.positionToRenderAt.multiplyScalar(DomeRadius);
    this.positionToRenderAt = new THREE.Vector3(this.positionToRenderAt.x, this.positionToRenderAt.y, -this.positionToRenderAt.z);
    this.colour = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
}

export const tempStarCatalog = [
  { name: "Sagittarius A*", x: 25.22, y: -20.91, z: 25900.0, color: 0xffb86c },
  { name: "Lave", x: 75.75, y: 48.75, z: 70.75, color: 0x50fa7b },
  { name: "Colonia", x: -9530.5, y: -910.28, z: 19808.12, color: 0x8be9fd },
  { name: "Beagle Point", x: -1111.56, y: -134.22, z: 65269.75, color: 0xff5555 },
];
