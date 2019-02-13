import React, { Component } from "react";
import * as d3 from "d3";
const margin = { top: 20, right: 5, bottom: 20, left: 45 };

class BarChart extends Component {
  state = {
    bars: [],
    yTickFormat: 1000000,
    yTickLabel: 'M',
  };

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData, width, height } = nextProps;

    if (!visData) return {};

    const titles = visData.map(d => d.title);
    const xScale = d3
      .scaleBand()
      .domain(titles)
      .range([margin.left, width - margin.right])
      .paddingInner(0.75)
      .paddingOuter(.4);

    const [yMin, yMax] = d3.extent(visData, d => parseInt(d.boxOffice));
    const yTickFormat = yMax >= 1000000 ? 1000000 : 1000;
    const yTickLabel = yMax >= 1000000 ? 'M' : 'k';
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([0, height - margin.bottom - margin.top]);
    const yAxisScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const bars = visData.map(d => {
      return {
        x: xScale(d.title),
        y: height - yScale(parseInt(d.boxOffice)) - margin.bottom,
        height: yScale(d.boxOffice),
        fill: '#f4f4f4'
      };
    });

    return { bars, xScale, yScale, yAxisScale, yTickFormat, yTickLabel };
  }

  componentDidUpdate() {
    const {
      xScale,
      yAxisScale,
      yTickFormat,
      yTickLabel,
    } = this.state;
    this.xAxis
      .scale(xScale);
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
      bars,
      xScale,
    } = this.state;

    const { width, height } = this.props;

    return (
      <div className='chart-container primary-chart'>
        <svg width={width} height={height}>
          {bars.map(d => (
            <rect x={d.x} y={d.y} width={xScale.bandwidth()} height={d.height} fill={d.fill} />
          ))}
          <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    );
  }
}

export default BarChart;
