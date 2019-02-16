import React, { Component } from "react";
import * as d3 from "d3";
import ChartTitle from '../../../components/ChartTitle/ChartTitle';
import '../../../App.scss';
const margin = { top: 20, right: 15, bottom: 20, left: 150 };

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
      .range([0, width - margin.right - margin.left]);

    const xAxisScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const bars = visData.map(d => {
      return {
        value: d.metascore,
        x: margin.left,
        y: yScale(d.title),
        width: xScale(d.metascore),
        title: d.title,
      };
    });

    return { bars, xScale, xAxisScale, yScale };
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
      chartTitle,
      onDataHover,
      hoveredMovie,
    } = this.props;

    console.log('ratings hoveredMovie', hoveredMovie);

    return (
      <div className='chart-container primary-chart'>
        <ChartTitle title={chartTitle} />
        <svg width={width} height={height}>
          {bars.map(d => (
            <React.Fragment>
              <rect
                className={`chart-standard-fg ${hoveredMovie === d.title ? 'hovered-movie' : '' }`} 
                x={d.x} y={d.y} width={d.width} height={yScale.bandwidth()}
                onMouseOver={() => onDataHover(d.title)}
                onMouseOut={() => onDataHover()}
              />
              <text x={d.x + d.width - 60} y={d.y + yScale.bandwidth()} className='bar-value'>{d.value}</text>
            </React.Fragment>
          ))}
          {!bars.length && <text x={width/2} y={height/2} className='no-data-message'>No Ratings Data Available</text>}
          <g ref="xAxis" transform={`translate(${margin.left}, ${height - margin.bottom - margin.top})`} />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    );
  }
}

export default RatingsBarChartHorizontal;
