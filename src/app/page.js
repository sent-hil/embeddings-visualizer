"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useState } from "react";

const DATA = Array.from(Array(100)).map((_, i) => ({
  text: "Hello",
  x: i,
  y: i * 2,
}));

export default function Home() {
  const [data, setData] = useState(DATA);
  const ulRef = useRef(null);

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
    });

    // On click, scroll to the item in the list and highlight it.
    myPlot.on("plotly_click", function (d) {
      const i = d.points[0].pointNumber,
        item = ulRef.current.children[i];

      item.scrollIntoView({ behavior: "instant" });
      item.classList.add("bg-blue-100");

      setTimeout(() => {
        item.classList.remove("bg-blue-100");
      }, 1000);
    });
  }, [data]);

  return (
    <main className="grid h-screen grid-cols-10">
      <div id="plotly" className="col-span-7"></div>
      <div className="h-screen col-span-3 overflow-y-scroll bg-white">
        <h1 className="text-xl font-bold">Data</h1>
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
