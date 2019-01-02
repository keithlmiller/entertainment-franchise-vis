import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 45 };

class ScatterPlot extends Component {
  state = {
    dots: [],
    yTickFormat: 1000000,
    yTickLabel: 'M',
  };

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData } = nextProps;

    if (!visData) return {};

    const xExtent = d3.extent(visData, d => new Date(d.year));
    const xScale = d3
      .scaleTime()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);

    const [yMin, yMax] = d3.extent(visData, d => parseInt(d.lifetime_gross));
    const yTickFormat = yMax >= 1000000 ? 1000000 : 1000;
    const yTickLabel = yMax >= 1000000 ? 'M' : 'k';
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax - 1])
      .range([0, height - margin.bottom - margin.top]);
    const yAxisScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const dots = visData.map(d => {
      return {
        x: xScale(new Date(d.year)),
        y: height - yScale(parseInt(d.lifetime_gross)) - margin.bottom,
        fill: '#f4f4f4',
        title: d.title,
      };
    });

    return { dots, xScale, yScale, yAxisScale, yTickFormat, yTickLabel };
  }

  componentDidUpdate() {
    const {
      xScale,
      yAxisScale,
      yTickFormat,
      yTickLabel,
    } = this.state;
    this.xAxis
      .scale(xScale)
      .tickFormat(d3.timeFormat('%Y'));
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis
      .scale(yAxisScale)
      .tickFormat(
        d => `$${parseInt((d) / yTickFormat)}${yTickLabel}`
      );
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    const {
      dots,
    } = this.state;

    return (
      <svg width={width} height={height}>
        {dots.map(d => (
          <circle cx={d.x} cy={d.y} r={3.5} fill={d.fill}>
            <title>{d.title}</title>
          </circle>
        ))}
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
      </svg>
    );
  }
}

export default ScatterPlot;




