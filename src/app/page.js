"use client";

import { useEffect, useRef, Fragment, useState } from "react";
import Script from "next/script";
import FlyOut from "./flyout";

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
        item = ulRef.current.children.namedItem(i.toString());

      if (!item) {
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
        // Show only data points that are within the zoomed range.
        const x1 = Math.ceil(d["xaxis.range[0]"]);
        const x2 = Math.ceil(d["xaxis.range[1]"]);
        const y2 = d["yaxis.range[1]"];

        setData(DATA.slice(x1, x2).filter((d) => d.y <= y2));
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
