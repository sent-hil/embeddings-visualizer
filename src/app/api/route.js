const { PCA } = require("ml-pca");
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getRandomEmbedding(body) {
  const response = await fetch("http://localhost:4567/embedding", {
    body,
    method: "POST",
  });

  const json = await response.json();
  return json["data"][0]["embedding"];
}

async function getOpenAiEmbedding(input) {
  const response = await openai.embeddings.create({
    input,
    model: "text-embedding-ada-002",
  });

  console.log(response);

  return response["data"][0]["embedding"];
}

export async function POST(request) {
  const res = await request.json();
  const inputs = res["input"].split("\n").filter((x) => x.trim() !== "");

  // get embedding for each line in input
  const dataset = [];
  for (let i = 0; i < inputs.length; i++) {
    const embedding = await getRandomEmbedding(inputs[i]);
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
