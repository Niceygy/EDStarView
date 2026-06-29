import { Star } from "./star";
import { HiddenCanvas } from "./constants";

export function createStarImage(s: Star): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // 1. Ensure absolute alpha transparency for the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Draw your red system indicator square (centered)
  ctx.fillStyle = s.colour;
  ctx.fillRect(64, 64, 128, 128);

  // 3. Render the system text safely below the block
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText(s.systemName, 128, 230);

  return canvas;
}
