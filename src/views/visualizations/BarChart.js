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

    console.log('data', data);
    if (!data) return {};

    const titles = data.map(d => d.title);
    const xScale = d3
      .scaleBand()
      .domain(titles)
      .range([margin.left, width - margin.right])
      .paddingInner(0.05);

    // 2. map high temp to y-position
    // get min/max of high temp
    const [yMin, yMax] = d3.extent(data, d => d.lifetime_gross);
    console.log('yMin', yMin);
    console.log('yMax', yMax);
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      // .range([height - margin.bottom, margin.top]);
      .range([0, height]);

    console.log('yScale max', yScale(yMax))


    // array of objects: x, y, height
    const bars = data.map(d => {
      console.log('height', yScale(d.lifetime_gross));
      return {
        x: xScale(d.title) + 63,
        y: height - yScale(d.lifetime_gross) - margin.bottom,
        height: yScale(d.lifetime_gross),
        fill: '#f4f4f4'
      };
    });

    return { bars, xScale, yScale };
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    // this.xAxis.scale();
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    // this.yAxis.scale();
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map(d => (
          <rect x={d.x} y={d.y} width={20} height={d.height} fill={d.fill} />
        ))}
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
      </svg>
    );
  }
}

export default BarChart;
