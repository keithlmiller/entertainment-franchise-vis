import React, { Component } from "react";
import * as d3 from "d3";
import ChartTitle from '../../../components/ChartTitle/ChartTitle';
import '../../../App.css';
const margin = { top: 20, right: 5, bottom: 20, left: 150 };

class RatingsBarChartHorizontal extends Component {
  state = {
    bars: [],
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

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const bars = visData.map(d => {
      return {
        value: d.metascore,
        x: margin.left,
        y: yScale(d.title),
        width: xScale(d.metascore),
        fill: '#f4f4f4'
      };
    });

    return { bars, xScale, yScale };
  }

  componentDidUpdate() {
    const {
      xScale,
      yScale,
    } = this.state;
    this.xAxis
      .scale(xScale)
      .tickFormat(d => `${d}%`);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis
      .scale(yScale)
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
              <text x={d.width - d.width / 20} y={d.y + yScale.bandwidth()} className='bar-value'>{d.value}</text>
            </React.Fragment>
          ))}
          {!bars.length && <text x={width/2} y={height/2} className='no-data-message'>No Ratings Data Available</text>}
          <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    );
  }
}

export default RatingsBarChartHorizontal;
