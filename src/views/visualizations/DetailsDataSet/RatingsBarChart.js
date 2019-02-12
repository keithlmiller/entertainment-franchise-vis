import React, { Component } from "react";
import * as d3 from "d3";
import '../../../App.scss';
const margin = { top: 20, right: 5, bottom: 20, left: 45 };

class RatingsBarChart extends Component {
  state = {
    bars: [],
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
        value: d.metascore,
        x: xScale(d.title),
        y: height - yScale(parseInt(d.metascore)) - margin.bottom,
        height: yScale(parseInt(d.metascore)),
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

    const { width, height } = this.props;

    return (
      <div className='output-chart'>
        <svg width={width} height={height}>
          {bars.map(d => (
            <React.Fragment>
              <rect x={d.x} y={d.y} width={xScale.bandwidth()} height={d.height} fill={d.fill} />
              <text x={d.x + xScale.bandwidth()/2} y={d.y + 40} className='bar-value'>{d.value}</text>
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

export default RatingsBarChart;
