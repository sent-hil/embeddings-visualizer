const DATA = Array.from(Array(100)).map((_, i) => ({
  text: "Hello",
  x: i,
  y: i * 2,
}));

export async function GET(request) {
  return Response.json(DATA);
}
