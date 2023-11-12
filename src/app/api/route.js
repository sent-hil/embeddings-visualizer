import { PCA } from "ml-pca";
import { getEmbedding } from "./embedding";

export async function POST(request) {
  const res = await request.json();
  const model = res["model"] || "random";
  const inputs = res["input"].split("\n").filter((x) => x.trim() !== "");

  // get embedding for each line in input
  const dataset = [];
  for (let i = 0; i < inputs.length; i++) {
    const embedding = await getEmbedding(model, inputs[i]);
    dataset.push({ embedding, text: inputs[i] });
  }

  // reduce dimensionality
  const embeddingsOnly = dataset.map((d) => d.embedding);
  const pca = new PCA(embeddingsOnly);
  const smaller = pca.predict(embeddingsOnly, { nComponents: 1 }).to1DArray();

  return Response.json(
    smaller.map((value, i) => {
      return { x: i, y: value, text: dataset[i].text };
    })
  );
}
