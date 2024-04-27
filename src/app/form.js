const models = {
  OpenAI: [
    "text-embedding-ada-002",
    "text-embedding-3-small",
    "text-embedding-3-large"
  ],
  Cohere: [
    "embed-english-v3.0",
    "embed-multilingual-v3.0",
    "embed-english-light-v3.0",
    "embed-multilingual-light-v3.0",
    "embed-english-v2.0",
    "embed-english-light-v2.0",
    "embed-multilingual-v2.0",
  ],
  Voyage: [
    "voyage-2",
    "voyage-large-2",
    "voyage-lite-02-instruct",
  ]
}

const Form = ({
  onFormSubmit,
  setFlyOutOpen,
  setProvider,
  setModel,
  setInput,
  input,
  provider,
  model
}) => {
  const changeProvider = (p) => {
    setProvider(p)
    setModel(models[p][0])
  }

  return (
    <form
      method="POST"
      className="max-w-xl mx-auto mt-5"
      onSubmit={(e) => {
        onFormSubmit(e);
        setFlyOutOpen(false);
      }}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Items
          </label>
          <div className="mt-2.5">
            <textarea
              name="message"
              id="message"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="w-full mt-8">
            <label
              htmlFor="provider"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Provider
            </label>
            <div className="w-full mt-2">
              <select
                id="provider"
                name="provider"
                autoComplete="provider-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={provider}
                onChange={(e) => changeProvider(e.target.value) }
              >
                {
                  Object.keys(models).map((provider) => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="w-full mt-4">
            <label
              htmlFor="model"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Model
            </label>
            <div className="w-full mt-2">
              <select
                id="model"
                name="model"
                autoComplete="model-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {
                  models[provider].map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="submit"
          className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default Form;
