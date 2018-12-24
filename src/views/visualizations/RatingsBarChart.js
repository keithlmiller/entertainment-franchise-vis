import React, { Component } from "react";
import * as d3 from "d3";
const width = 800;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 45 };

class RatingsBarChart extends Component {
  state = {
    bars: [],
  };

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData } = nextProps;

    if (!visData) return {};

    const titles = visData.map(d => d.Title);
    const xScale = d3
      .scaleBand()
      .domain(titles)
      .range([margin.left, width - margin.right])
      .paddingInner(0.75)
      .paddingOuter(.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, height - margin.bottom - margin.top]);
    const yAxisScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    const bars = visData.map(d => {
      return {
        x: xScale(d.Title),
        y: height - yScale(parseInt(d.Metascore)) - margin.bottom,
        height: yScale(parseInt(d.Metascore)),
        fill: '#f4f4f4'
      };
    });

    return { bars, xScale, yScale, yAxisScale };
  }

  componentDidUpdate() {
    const {
      xScale,
      yAxisScale,
    } = this.state;
    this.xAxis
      .scale(xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis
      .scale(yAxisScale)
      .tickFormat(d => `${d}%`);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    const {
      bars,
      xScale,
    } = this.state;

    return (
      <svg width={width} height={height}>
        {bars.map(d => (
          <rect x={d.x} y={d.y} width={xScale.bandwidth()} height={d.height} fill={d.fill} />
        ))}
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
      </svg>
    );
  }
}

export default RatingsBarChart;
