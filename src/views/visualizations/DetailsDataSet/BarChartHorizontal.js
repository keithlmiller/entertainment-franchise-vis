import React, { Component } from "react";
import * as d3 from "d3";
import ChartTitle from '../../../components/ChartTitle/ChartTitle';
const margin = { top: 20, right: 5, bottom: 20, left: 150 };

class BarChartHorizontal extends Component {
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
    const yScale = d3
      .scaleBand()
      .domain(titles)
      .range([0, height - margin.bottom - margin.top])
      .paddingInner(.35)
      .paddingOuter(.25);

    const [xMin, xMax] = d3.extent(visData, d => parseInt(d.boxOffice));
    const xTickFormat = xMax >= 1000000 ? 1000000 : 1000;
    const xTickLabel = xMax >= 1000000 ? 'M' : 'k';
    const xScale = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([margin.left, width - margin.right - margin.left]);

    const bars = visData.map(d => {
      return {
        x: margin.left,
        y: yScale(d.title),
        width: xScale(d.boxOffice),
        fill: '#f4f4f4'
      };
    });

    return { bars, xScale, yScale, xTickFormat, xTickLabel };
  }

  componentDidUpdate() {
    const {
      yScale,
      xScale,
      xTickFormat,
      xTickLabel,
    } = this.state;
    this.yAxis
      .scale(yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
    this.xAxis
      .scale(xScale)
      .tickFormat(
        d => `$${parseInt((d) / xTickFormat)}${xTickLabel}`
      );
    d3.select(this.refs.xAxis).call(this.xAxis);
  }

  render() {
    const {
      bars,
      yScale,
    } = this.state;

    const { 
      width, 
      height, 
      chartTitle 
    } = this.props;

    return (
      <div className='output-chart'>
        <ChartTitle title={chartTitle} />
        <svg width={width} height={height}>
          {bars.map(d => (
            <rect x={d.x} y={d.y} width={d.width} height={yScale.bandwidth()} fill={d.fill} />
          ))}
          <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    );
  }
}

export default BarChartHorizontal;
