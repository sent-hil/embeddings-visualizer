import Hash from "./hash";

export const PlotlyElementId = "plotly"
export const DefaultPointColor = "#1f77b4"

export function setupPlotly(originalData, setData) {
  const ulRef = document.getElementById("data_list");

  const xs = originalData.map((d) => d.x);
  const ys = originalData.map((d) => d.y);
  const ts = originalData.map((d) => d.text);

  const colors = originalData.map((d) => d.color || DefaultPointColor)

  // find item in originalData where x matches the name attribute of the list item

  if (typeof window.Plotly === "undefined") {
    return;
  }

  const myPlot = document.getElementById(PlotlyElementId)

  Plotly.newPlot(myPlot, {
    data: [
      {
        x: xs,
        y: ys,
        text: ts,
        type: "scatter",
        mode: "markers",
        marker: { size: 12, colors: colors },
      },
    ],
    layout: { title: "Embeddings Visualizer" },
  });

  // On click, scroll to the item in the list and highlight it.
  myPlot.on("plotly_click", (d) => {
    // can't use x/y point, since plotly truncates 0 suffixes
    const item = ulRef.children.namedItem(Hash(d.points[0].text));

    if (!item) {
      console.log("Item not found", d.points[0])
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
      setData(originalData);
    } else {
      // Show only data points that are within the zoomed range.
      const x1 = Math.ceil(d["xaxis.range[0]"]);
      const x2 = Math.ceil(d["xaxis.range[1]"]);
      const y2 = d["yaxis.range[1]"];

      setData(originalData.slice(x1, x2).filter((d) => d.y <= y2));
    }
  });

  // Show point under hover.
  myPlot.on("plotly_hover", (d) => {
    const { text } = originalData.find(x => x.x == d.points[0].x)

    if (text) {
      document.getElementById("hover_info").innerHTML = `<p class="pl-2">${text}</p>`;
    }
  });

  // Remove hover info once the mouse leaves the plot.
  myPlot.on("plotly_unhover", () => {
    document.getElementById("hover_info").innerHTML = "";
  });
}
