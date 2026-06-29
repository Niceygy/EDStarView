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

export function debugDot(): THREE.Mesh {
  //DEBUG DOT
  const dotGeometry = new THREE.SphereGeometry(2, 16, 16);
  const dotMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: false,
  });
  const debugDot = new THREE.Mesh(dotGeometry, dotMaterial);
  debugDot.position.set(0, 0);
  return debugDot;
}
