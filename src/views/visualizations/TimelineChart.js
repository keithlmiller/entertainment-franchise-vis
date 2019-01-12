import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 100;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class TimelineChart extends Component {
  state = {
    brushStart: 1900,
    brushEnd: 1910,
  };

  xAxis = d3.axisBottom().tickFormat(d3.timeFormat("%Y"));

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData } = nextProps;
    if (!visData) return {};

    const extent = d3.extent(visData, d => parseInt(d.year));
    const xScale = d3
      .scaleLinear()
      .domain(extent)
      .range([margin.left, width - margin.right]);
    return { xScale };
  }

  componentDidMount() {
    this.brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
      .on("end", this.brushmove);
    d3.select(this.refs.brush)
      .call(this.brush)
      .call(this.brush.move, [5, 100]);



    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
  }

  brushmove = () => {
    if (!d3.event.selection) {
      this.props.updateRange([]);
      return;
    }
    const [x1, x2] = d3.event.selection;
    const range = [this.state.xScale.invert(x1), this.state.xScale.invert(x2)];

    this.props.updateRange(this.props.visData, range);
  }

  render() {

    return (
      <svg width={width} height={height}>
        <g ref="brush" />
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
      </svg>
    )
  }
}

export default TimelineChart;
