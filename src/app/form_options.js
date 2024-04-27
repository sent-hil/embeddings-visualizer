import { models } from "./models";

const FormOptions = ({provider, setProvider, model, setModel}) => {
  const changeProvider = (p) => {
    setProvider(p)
    setModel(models[p][0])
  }

  return (
    <div className="flex mt-2 gap-x-2">
      <div className="flex-1">
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
      <div className="flex-1">
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
  )
}

export default FormOptions;
