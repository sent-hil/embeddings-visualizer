import OpenAI from "openai";
import { CohereClient, Cohere } from "cohere-ai";
import axios from 'axios';

export async function getEmbedding(provider, model, inputs) {
  switch (provider) {
    case "openai":
      return await getOpenAiEmbedding(model, inputs);
    case "cohere":
      return await getCohereEmbedding(model, inputs);
    case "voyage":
      return await getVoyageEmbedding(model, inputs);
  }
}

async function getOpenAiEmbedding(model, inputs) {
  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

  const dataset = [];
  for (let i = 0; i < inputs.length; i++) {
    const response = await openai.embeddings.create({
      input: inputs[i],
      model
    });
    dataset.push({embedding: response["data"][0]["embedding"], text: inputs[i]});
  }

  return dataset
}

async function getCohereEmbedding(model, inputs) {
  const cohere = new CohereClient({token: process.env.COHERE_API_KEY});

  const response = await cohere.embed({
    texts: inputs,
    model,
    inputType: Cohere.EmbedInputType.SearchDocument,
    embeddingTypes: [Cohere.EmbeddingType.Float],
  })
  const { embeddings, texts } = response

  const dataset = []
  for (let i = 0; i < inputs.length; i++) {
    dataset.push({embedding: embeddings.float[i], text: texts[i]});
  }

  return dataset
}

async function getVoyageEmbedding(model, inputs) {
  const response = await axios.post(
    'https://api.voyageai.com/v1/embeddings',
    {input: inputs, model},
    {
      headers: {
        "Authorization": `Bearer ${process.env.VOYAGE_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  )
  const {data} = response.data

  const dataset = []
  for (let i = 0; i < data.length; i++) {
    dataset.push({embedding: data[i].embedding, text: inputs[i]});
  }

  return dataset
}
