"use client";

import { useState } from "react";
import Script from "next/script";
import FlyOut from "./flyout";
import { setupPlotly } from "./chart";

export default function Home() {
  const [data, setData] = useState([]);
  const [flyOutOpen, setFlyOutOpen] = useState(true);

  const [input, setInput] = useState("");
  const [provider, setProvider] = useState("OpenAI");
  const [model, setModel] = useState("text-embedding-ada-002");

  const [showSpinner, setShowSpinner] = useState(false);

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
    <main className="grid h-screen grid-cols-10">
      <FlyOut
        flyOutOpen={flyOutOpen}
        setFlyOutOpen={setFlyOutOpen}
        onFormSubmit={onFormSubmit}
        input={input}
        setInput={setInput}
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
      />
      <div className="col-span-7">
        <div id="plotly" className="h-[95%]"></div>
        <div id="hover_info"></div>
      </div>
      <div className="h-screen col-span-3 px-4 overflow-y-scroll bg-white">
        <div className="flex items-center justify-between pt-6 align-middle">
          <div class="flex items-center align-middle">
            {" "}
            <h1 className="text-xl font-bold">Data</h1>&nbsp;-&nbsp;
            <button
              className="text-sm italic"
              onClick={() => setFlyOutOpen(true)}
            >
              Click to Edit
            </button>
          </div>
          {
            showSpinner && (
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )
          }
        </div>
        {
          input.length > 0 && (
            <div className="pt-2">
              <p className="text-sm"><span class="font-semibold">Provider: </span>{provider}</p>
              <p className="text-sm"><span class="font-semibold">Model: </span>{model}</p>
            </div>
          )
        }
        <ul className="pt-2 mb-10" id="data_list">
          {data.map((d) => (
            <li
              className="flex pt-1 overflow-auto whitespace-normal transition-colors rounded-lg"
              name={d.x}
              key={d.i}
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
