import React, { Component } from "react";
import * as d3 from "d3";
const width = 800;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 45 };

class BarChart extends Component {
  state = {
    bars: [],
  };

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft()
    .tickFormat(
      d => `$${parseInt((d) / 1000000)}M`
    );

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;

    if (!data) return {};

    const titles = data.map(d => d.title);
    const xScale = d3
      .scaleBand()
      .domain(titles)
      .range([margin.left, width - margin.right])
      .paddingInner(0.75)
      .paddingOuter(.4);

    const [yMin, yMax] = d3.extent(data, d => d.lifetime_gross);
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([0, height - margin.bottom - margin.top]);
    const yAxisScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const bars = data.map(d => {
      console.log('height', yScale(d.lifetime_gross));
      return {
        x: xScale(d.title),
        y: height - yScale(d.lifetime_gross) - margin.bottom,
        height: yScale(d.lifetime_gross),
        fill: '#f4f4f4'
      };
    });

    return { bars, xScale, yScale, yAxisScale };
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yAxisScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map(d => (
          <rect x={d.x} y={d.y} width={this.state.xScale.bandwidth()} height={d.height} fill={d.fill} />
        ))}
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
      </svg>
    );
  }
}

export default BarChart;
