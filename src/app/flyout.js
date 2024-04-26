import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

const FlyOut = ({
  flyOutOpen,
  setFlyOutOpen,
  onFormSubmit,
  input,
  setInput,
  setModel,
}) => {
  return (
    <Transition.Root show={flyOutOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setFlyOutOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative w-screen max-w-sm pointer-events-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setFlyOutOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title>
                        <p className="text-xl font-bold">Data</p>
                      </Dialog.Title>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      <form
                        method="POST"
                        className="max-w-xl mx-auto mt-5"
                        onSubmit={(e) => {
                          onFormSubmit(e);
                          setFlyOutOpen(false);
                        }}
                      >
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
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
                            <div className="w-full">
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
                                  onChange={(e) => setModel(e.target.value)}
                                >
                                  <option value="openai">OpenAI</option>
                                  <option value="cohere">Cohere</option>
                                  <option value="random">Random</option>
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
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default FlyOut;
