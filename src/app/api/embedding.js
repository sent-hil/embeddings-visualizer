import OpenAI from "openai";
import { CohereClient, Cohere, CohereError } from "cohere-ai";

export async function getEmbedding(model, input) {
  switch (model) {
    case "cohere":
      return await getCohereEmbedding(input);
    case "openai":
      return await getOpenAiEmbedding(input);
  }
}

async function getOpenAiEmbedding(input) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.embeddings.create({
    input,
    model: "text-embedding-ada-002",
  });

  return response["data"][0]["embedding"];
}

async function getCohereEmbedding(input) {
  const cohere = new CohereClient({token: "TAecikvGNXoNmycwws9CbysldT8tu5sNLBGh8BKp"})

  try {
    let response = await cohere.embed({
      texts: [input],
      model: "embed-english-v3.0",
      inputType: Cohere.EmbedInputType.SearchDocument,
      embeddingTypes: [Cohere.EmbeddingType.Float],
    })

    return response.embeddings.float[0]
  } catch (err) {
    if (err instanceof CohereError) {
      return err.body
    } else {
      return err
    }
  }
}
