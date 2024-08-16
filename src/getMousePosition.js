export default function getMousePosition(canvas, e) {
  const r = canvas.getBoundingClientRect();
  const widthScale = canvas.width / r.width;
  const heightScale = canvas.height / r.height;
  const x = (e.clientX - r.left) * widthScale;
  const y = (e.clientY - r.top) * heightScale;

  return { x, y };
}
