import { PCA } from "ml-pca";
import { getEmbedding } from "./embedding";

const OPENAI = "openai";
const COHERE = "cohere";
const ALLOWED_PROVIDERS = [OPENAI, COHERE];

export async function POST(request) {
  const res = await request.json();

  const provider = res["provider"];
  const model = provider === OPENAI ? "text-embedding-3-small" : "embed-english-v3.0"
  const inputs = res["input"].split("\n").filter((x) => x.trim() !== "");

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return Response.json({
      error: `Invalid provider. Only ${ALLOWED_PROVIDERS.join(",")} are allowed.`,
    });
  }

  if (inputs.length <= 1) {
    return Response.json({ error: "`inputs` must have size of at least 2" });
  }

  try {
    const dataset = await getEmbedding(provider, model, inputs)

    // reduce dimensionality
    const embeddingsOnly = dataset.map((d) => d.embedding);
    const pca = new PCA(embeddingsOnly);
    const smaller = pca.predict(embeddingsOnly, { nComponents: 2 }).to2DArray();

    return Response.json(
      smaller.map((values, i) => {
        return { i, i, x: values[0].toPrecision(3), y: values[1].toPrecision(3), text: dataset[i].text };
      })
    );
  } catch (err) {
    return Response.json({ error: err.message });
  }
}
