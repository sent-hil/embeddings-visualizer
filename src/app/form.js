import { useState } from "react";
import FormOptions from "./form_options";
import { setupPlotly } from "./chart";

const Form = ({setFlyOutOpen, setData, setShowSpinner, input, setInput}) => {
  const [providerCount, setProviderCount] = useState(1);
  const [provider, setProvider] = useState("OpenAI");
  const [model, setModel] = useState("text-embedding-ada-002");

  const onFormSubmit = (e) => {
    e.preventDefault();

    setShowSpinner(true);

    fetch("/api", {
      method: "POST",
      body: JSON.stringify({ input, model, provider }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data["error"]) {
        return alert(data["error"]);
      }
      setData(data);
      setupPlotly(data, setData);
    })
    .finally(() => { setShowSpinner(false) })
  };

  return (
    <form
      method="POST"
      className="max-w-2xl mx-auto mt-5"
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
          {
            Array(providerCount).fill().map((_, i) => (
              <FormOptions
                provider={provider}
                setProvider={setProvider}
                model={model}
                setModel={setModel}
                key={i}
              />
            ))
          }
          <div className="mt-2">
            <a href="#" className="text-sm" onClick={() => setProviderCount((p) => p+1)}>Add new Provider</a>
          </div>
        </div>
      </div>
      <div className="mt-5">
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
