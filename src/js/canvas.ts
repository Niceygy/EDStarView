import { Star } from "./star";
import { HiddenCanvas } from "./constants";

export function createStarImage(s: Star): string {
  const ctx: CanvasRenderingContext2D = HiddenCanvas.getContext("2d")!;
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, 150, 75);

  //   //https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
  //   var image = HiddenCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

  return "image";
}
