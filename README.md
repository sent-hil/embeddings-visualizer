# Embeddings Visualizer

## Getting Started

Development server:

```bash
npm run dev
```

Open [http://localhost:3223](http://localhost:3223) with your browser to see the result.

## Docker

```
docker build -t embeddings-visualizer:latest .
docker run -p 3223:3223 -e OPENAI_API_KEY=$OPENAI_API_KEY -e VOYAGE_API_KEY=$VOYAGE_API_KEY -e COHERE_API_KEY=$COHERE_API_KEY embeddings-visualizer:latest
```
