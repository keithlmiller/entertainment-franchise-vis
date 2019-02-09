import React, { Component } from "react";
import * as d3 from "d3";
import ChartTitle from '../../../components/ChartTitle/ChartTitle';
const margin = { top: 20, right: 20, bottom: 20, left: 150 };

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

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (!visData) return {};

    const titles = visData.map(d => d.title);
    const yScale = d3
      .scaleBand()
      .domain(titles)
      .range([0, chartHeight])
      .paddingInner(.35)
      .paddingOuter(.25);


    const [xMin, xMax] = d3.extent(visData, d => d.boxOffice);
    const xTickFormat = xMax >= 1000000 ? 1000000 : 1000;
    const xTickLabel = xMax >= 1000000 ? 'M' : 'k';
    const xScale = d3
      .scaleLinear()
      .domain([0, 1000000000])
      .range([0, chartWidth]);

    const xAxisScale = d3
      .scaleLinear()
      .domain([0, 1000000000])
      .range([margin.left, width - 60]);

    const bars = visData.map(d => {
      return {
        x: margin.left,
        y: yScale(d.title),
        width: xScale(d.boxOffice),
        fill: '#f4f4f4',
        value: d.boxOffice,
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
    this.xAxis
      .scale(xScale)
      .tickFormat(
        d => `$${parseInt((d) / xTickFormat)}${xTickLabel}`
      );
    d3.select(this.refs.xAxis).call(this.xAxis).call(g => g.select(".domain").remove());
    this.yAxis.scale(yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
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
            <React.Fragment>
              <rect x={d.x} y={d.y} width={d.width} height={yScale.bandwidth()} fill={d.fill} />
              <text x={d.x + d.width - 75} y={d.y + yScale.bandwidth()} className='bar-value'>${d3.format(',')(d.value)}</text>
            </React.Fragment>
          ))}
          <g ref="xAxis" transform={`translate(${margin.left}, ${height - margin.bottom - margin.top})`} />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    );
  }
}

export default BarChartHorizontal;
