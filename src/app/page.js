"use client";

import { useState } from "react";
import Script from "next/script";
import FlyOut from "./flyout";
import Spinner from "./spinner";

export default function Home() {
  const [data, setData] = useState([]);
  const [flyOutOpen, setFlyOutOpen] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [input, setInput] = useState("");

  return (
    <main className="grid h-screen grid-cols-10">
      <FlyOut
        flyOutOpen={flyOutOpen}
        setFlyOutOpen={setFlyOutOpen}
        setData={setData}
        setShowSpinner={setShowSpinner}
        input={input}
        setInput={setInput}
      />
      <div className="col-span-7">
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
