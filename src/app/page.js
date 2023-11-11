"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import FlyOut from "./flyout";
import { setupPlotly } from "./chart";

export default function Home() {
  const [data, setData] = useState([]);
  const [flyOutOpen, setFlyOutOpen] = useState(false);

  useEffect(() => {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setupPlotly(data, setData);
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
          {" "}
          <h1 className="text-xl font-bold">Data</h1>&nbsp;-&nbsp;
          <button
            className="text-sm italic"
            onClick={() => setFlyOutOpen(true)}
          >
            Click to Edit
          </button>
        </div>
        <ul className="pt-2 mb-10" id="data_list">
          {data.map((d) => (
            <li
              className="flex pt-1 overflow-auto transition-colors rounded-lg whitespace-nowrap"
              name={d.x}
              key={d.x}
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
