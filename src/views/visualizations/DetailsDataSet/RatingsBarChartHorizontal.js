import React, { Component } from "react";
import * as d3 from "d3";
import ChartTitle from '../../../components/ChartTitle/ChartTitle';
import '../../../App.scss';
const margin = { top: 20, right: 15, bottom: 20, left: 150 };

class RatingsBarChartHorizontal extends Component {
  state = {
    bars: [],
  };

  xAxisLines = d3.axisBottom();
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

    const {
      height,
    } = this.props;

    this.xAxisLines
      .scale(xScale)
      .tickSize(height - margin.bottom - margin.top);
    this.xAxis
      .scale(xScale)
      .tickFormat(d => `${d}`);
    
    const xAxisLines = d3.select(this.refs.xAxisLines);

    xAxisLines
      .call(this.xAxisLines)
      .call(g => g.select('.domain').remove())
      .selectAll('text').remove()

    xAxisLines
      .selectAll('line')
      .attr('stroke', '#b3b3b3')
      .attr('stroke-dasharray', '2,2')
    
    const xAxis = d3.select(this.refs.xAxis);
    xAxis
      .call(this.xAxis)
      .call(g => g.select('.domain').remove())
      .selectAll('.tick:first-of-type').remove()
    
    xAxis
      .selectAll('line')
      .attr('stroke', '#8d8d8d');

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
      onDataClick,
      hoveredMovie,
      selectedMovie,
      sortClass,
    } = this.props;

    return (
      <div className='chart-container primary-chart'>
        <ChartTitle title={chartTitle} />
        <svg width={width} height={height}>
          <defs>
            <clipPath id='chart-clip-path'>
              <rect x={margin.left} y='0' width={width} height={height} />
            </clipPath>
          </defs>

          <g ref="xAxisLines" className='background-lines' transform={`translate(${margin.left}, 0)`} />
          {bars.map(d => (
            <React.Fragment>
              <rect
                className={`chart-standard-fg ${hoveredMovie === d.title ? 'hovered-movie' : ''} ${selectedMovie === d.title ? 'selected-movie' : ''} ${sortClass}`}
                x={d.x} y={d.y} width={d.width} height={yScale.bandwidth()}
                onMouseOver={() => onDataHover(d.title)}
                onMouseOut={() => onDataHover()}
                onClick={() => onDataClick(d.title)}
                clip-path='url(#chart-clip-path)'
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
