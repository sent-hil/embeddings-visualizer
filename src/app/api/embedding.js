import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(model, input) {
  switch (model) {
    case "random":
      return await getRandomEmbedding(input);
    case "openai":
      return await getOpenAiEmbedding(input);
  }
}

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

  return response["data"][0]["embedding"];
}
