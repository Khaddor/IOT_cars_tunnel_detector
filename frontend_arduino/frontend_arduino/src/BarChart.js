import React, { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import carsData from './carData.json'; // Import the local JSON file

const BarChart = () => {
  const ref = useRef(null);
  const tooltipRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("2019-01-01");
  const [endDate, setEndDate] = useState("2019-01-07");

  useEffect(() => {
    // Process data from the imported JSON file
    setData(carsData.data);
    drawChart(carsData.data);
  }, []);

  const drawChart = (data) => {
    const container = ref.current;
    if (!container) return;

    d3.select(container).select("svg").remove();

    const margin = { top: 30, right: 30, bottom: 70, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const max = Math.max(...data.map(o => o.averageCars)) * 1.2;
    const y = d3.scaleLinear().domain([0, max]).range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.hour.toString()))
      .padding(0.2);

    const xAxis = d3.axisBottom(x);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.hour.toString()) || 0;
      })
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", "#dde5b6")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#adc178");
        handleMouseOver(event, d);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#dde5b6");
        handleMouseOut();
      });

    bars.transition()
      .duration(800)
      .attr("y", function (d) {
        return y(d.averageCars);
      })
      .attr("height", function (d) {
        return height - y(d.averageCars);
      })
      .delay(function (d, i) {
        return (i * 500);
      });
  };

  const handleMouseOver = (event, d) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    tooltip.innerHTML = `<strong>Hour:</strong> ${d.hour}<br/><strong>Average Cars:</strong> ${d.averageCars}`;
    tooltip.style.visibility = "visible";
    tooltip.style.top = event.clientY + "px";
    tooltip.style.left = event.clientX + "px";
  };

  const handleMouseOut = () => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    tooltip.style.visibility = "hidden";
  };

  const handleDateChange = (event, setter) => {
    setter(event.target.value);
  };

  return (
    <div className="BarChart" ref={ref}>
      <div ref={tooltipRef} style={{ position: "absolute", visibility: "hidden", backgroundColor: "rgba(0, 0, 0, 0.8)", color: "#fff", padding: "5px", borderRadius: "5px", zIndex: 9999 }}></div>
      {loading ? (
        <p>Loading...</p>
      ) : null}
    </div>
  );
};

export default BarChart;
