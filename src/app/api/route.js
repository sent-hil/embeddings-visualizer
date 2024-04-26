import { PCA } from "ml-pca";
import { getEmbedding } from "./embedding";

const ALLOWED_MODELS = ["random", "openai"];

export async function POST(request) {
  const res = await request.json();
  const model = res["model"] || "random";
  const inputs = res["input"].split("\n").filter((x) => x.trim() !== "");

  if (!ALLOWED_MODELS.includes(model)) {
    return Response.json({
      error: `Invalid model. Only ${ALLOWED_MODELS.join(",")} are allowed.`,
    });
  }

  if (inputs.length <= 1) {
    return Response.json({ error: "`inputs` must have size of at least 2" });
  }

  // get embedding for each line in input
  const dataset = [];
  for (let i = 0; i < inputs.length; i++) {
    const embedding = await getEmbedding(model, inputs[i]);
    dataset.push({ embedding, text: inputs[i] });
  }

  // reduce dimensionality
  const embeddingsOnly = dataset.map((d) => d.embedding);
  const pca = new PCA(embeddingsOnly);
  const smaller = pca.predict(embeddingsOnly, { nComponents: 2 }).to2DArray();

  return Response.json(
    smaller.map((values, i) => {
      return { i, i, x: values[0].toPrecision(3), y: values[1].toPrecision(3), text: dataset[i].text };
    })
  );
}
