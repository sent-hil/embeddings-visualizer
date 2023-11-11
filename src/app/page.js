"use client";

import { useEffect, useRef, Fragment, useState } from "react";
import Script from "next/script";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function FlyOut({ flyOutOpen, setFlyOutOpen }) {
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
                    <div className="relative flex-1 px-4 mt-6 sm:px-6">
                      {/* Your content */}
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
}

const DATA = Array.from(Array(100)).map((_, i) => ({
  text: "Hello",
  x: i,
  y: i * 2,
}));

async function getData() {
  return DATA;
}

export default function Home() {
  let serverData = getData();

  const [data, setData] = useState(DATA);
  const ulRef = useRef(null);

  const [flyOutOpen, setFlyOutOpen] = useState(false);

  useEffect(() => {
    const xs = DATA.map((d) => d.x);
    const ys = DATA.map((d) => d.y);
    const colors = DATA.map((d) => d.color || "#000");

    if (typeof window.Plotly === "undefined") {
      return;
    }

    const myPlot = document.getElementById("plotly");

    Plotly.newPlot(myPlot, {
      data: [
        {
          x: xs,
          y: ys,
          type: "scatter",
          mode: "markers",
          marker: { size: 12, colors: colors },
        },
      ],
      layout: { title: "Embeddings Visualizer" },
    });

    // On click, scroll to the item in the list and highlight it.
    myPlot.on("plotly_click", (d) => {
      const i = d.points[0].pointNumber,
        item = ulRef.current.children[i];

      if (item === undefined) {
        return;
      }

      item.scrollIntoView({ behavior: "instant" });
      item.classList.add("bg-blue-100");

      setTimeout(() => {
        item.classList.remove("bg-blue-100");
      }, 1000);
    });

    // Update the list when the chart is zoomed.
    myPlot.on("plotly_relayout", (d) => {
      if (d["xaxis.range[0]"] === undefined) {
        setData(DATA);
      } else {
        setData(DATA.slice(d["xaxis.range[0]"], d["xaxis.range[1]"]));
      }
    });

    // Show point under hover.
    myPlot.on("plotly_hover", (d) => {
      const p = d.points[0];
      const infoText = [p.x, p.y, DATA[p.x].text].join(", ");

      document.getElementById("hover_info").innerHTML = `<p>${infoText}</p>`;
    });

    // Remove hover info once the mouse leaves the plot.
    myPlot.on("plotly_unhover", () => {
      document.getElementById("hover_info").innerHTML = "";
    });
  }, []);

  return (
    <main className="grid h-screen grid-cols-10">
      <FlyOut flyOutOpen={flyOutOpen} setFlyOutOpen={setFlyOutOpen} />
      <div className="col-span-7">
        <div id="plotly" className="h-[95%]"></div>
        <div id="hover_info"></div>
      </div>
      <div className="h-screen col-span-3 px-4 overflow-y-scroll bg-white">
        <div className="flex items-center pt-6 align-middle">
          <h1 className="text-xl font-bold">Data</h1>&nbsp;-&nbsp;
          <button
            className="text-sm italic"
            onClick={() => setFlyOutOpen(true)}
          >
            Click to Edit
          </button>
        </div>
        <ul className="pt-2 mb-10" ref={ulRef}>
          {data.map((d, i) => (
            <li
              className="flex pt-1 overflow-auto transition-colors rounded-lg whitespace-nowrap"
              key={i}
            >
              [{d.x}, {d.y}] - {d.text}
            </li>
          ))}
        </ul>
      </div>

      <Script
        src="https://cdn.plot.ly/plotly-2.27.0.min.js"
        strategy="beforeInteractive"
      ></Script>
    </main>
  );
}
