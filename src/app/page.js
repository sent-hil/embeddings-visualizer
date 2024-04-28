"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import FlyOut from "./flyout";
import Spinner from "./spinner";
import DefaultData from "./default_data";
import { setupPlotly, PlotlyElementId, DefaultPointColor } from "./chart";
import Hash from "./hash";

export default function Home() {
  const [data, setData] = useState(DefaultData.data);
  const [flyOutOpen, setFlyOutOpen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [input, setInput] = useState(DefaultData.input.join("\n"));
  const [provider, setProvider] = useState("OpenAI");
  const [model, setModel] = useState("text-embedding-ada-002");
  const [prevTimeout, setPrevTimeout] = useState(null);

  useEffect(() => {
    setupPlotly(data, setData);
  }, [data])

  const pointInGraph = (e) => {
    e.stopPropagation();

    const {x, y} = e.target.dataset
    if (x === undefined || y === undefined) {
      console.log("No x/y data found")
    }

    const restyle = (newColor) => {
      let colors = Array(10).fill(DefaultPointColor)
      const dataIndex = data.findIndex(d => d.x == x && d.y == y)
      colors[dataIndex] = newColor
      const update = {'marker.color': [colors]};
      Plotly.restyle(PlotlyElementId, update);
    }

    if (prevTimeout) { clearTimeout(prevTimeout) };
    restyle("red")
    setPrevTimeout(
      setTimeout(() => { restyle(DefaultPointColor) }, 3000)
    )
  }

  return (
    <main className="block h-screen md:grid md:grid-cols-10">
      <FlyOut
        flyOutOpen={flyOutOpen}
        setFlyOutOpen={setFlyOutOpen}
        setData={setData}
        setShowSpinner={setShowSpinner}
        input={input}
        setInput={setInput}
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
      />
      <div className="col-span-7 px-4 pt-6 bg-white">
        <div class="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold">Embeddings Visualizer</h1>
          <p>A Way to visualize embeddings returned by various AI providers.</p>
        </div>
        <div id="plotly" className="h-[95%]"></div>
        <div id="hover_info"></div>
      </div>
      <div className="h-screen col-span-3 px-4 overflow-y-scroll bg-white">
        <div className="flex items-center justify-between pt-6 align-middle">
          <div className="flex items-center align-middle">
            {" "}
            <h1 className="text-xl font-bold">Data</h1>&nbsp;-&nbsp;
            <button
              className="text-sm italic"
              onClick={() => setFlyOutOpen(true)}
            >
              Click to Edit
            </button>
          </div>
          {showSpinner && <Spinner />}
        </div>
        {
          input.length > 0 && (
            <div className="pt-2">
              <p className="text-sm"><span className="font-semibold">Provider: </span>{provider}</p>
              <p className="text-sm"><span className="font-semibold">Model: </span>{model}</p>
            </div>
          )
        }
        <ul className="pt-2 mb-10" id="data_list">
          {data.map((d) => (
            <li
              className="flex pt-1 overflow-auto whitespace-normal transition-colors rounded-lg"
              name={Hash(d.text)}
              key={d.i}
            >
              <div className="flex items-center space-x-1">
                <p>[{d.x},{d.y}]</p>
                <div className="hover:cursor-pointer">
                  <svg onClick={pointInGraph} data-x={d.x} data-y={d.y} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path onClick={pointInGraph} data-x={d.x} data-y={d.y} strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                <p>- {d.text}</p>
              </div>
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
