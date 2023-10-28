"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useState } from "react";

async function getData() {}

export default function Home() {
  //let [data, setData] = [{ y: [1, 2, 3] }];

  useEffect(() => {
    if (typeof window.Plotly === "undefined") {
      return;
    }

    const myPlot = document.getElementById("plotly");
    const data = [{ y: [1, 2, 3] }];
    Plotly.newPlot(myPlot, { data });

    myPlot.on("plotly_click", function (data) {
      console.log("event");
    });
  });

  return (
    <main className="grid grid-cols-10 h-screen">
      <div id="plotly" className="col-span-7"></div>
      <div className="col-span-1"></div>
      <Script
        src="https://cdn.plot.ly/plotly-2.27.0.min.js"
        strategy="beforeInteractive"
      ></Script>
    </main>
  );
}
