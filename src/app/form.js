import { useState } from "react";
import FormOptions from "./form_options";
import { setupPlotly } from "./chart";

const Form = ({
  setFlyOutOpen,
  setData,
  setShowSpinner,
  input,
  setInput,
  provider,
  setProvider,
  model,
  setModel
}) => {
  const [providerCount, setProviderCount] = useState(1);

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
            className="flex space-x-1 text-sm font-semibold leading-6 text-gray-900"
          >
            <p>Items</p><span className="italic font-normal">- Separate by new lines</span>
          </label>
          <div className="mt-2.5">
            <div
              contenteditable="true"
              name="message"
              id="message"
              rows={4}
              value={input}
              onInput={(e) => setInput(e.currentTarget.textContent)}
              className="overflow-auto break-words block w-full min-h-fit rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 whitespace-pre"
            >
              {input}
              </div>
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
