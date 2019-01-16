import React, { Component } from "react";
import * as d3 from "d3";
import Tooltip from '../../components/tooltip/tooltip';
const margin = { top: 20, right: 5, bottom: 20, left: 45 };

class ScatterPlot extends Component {
  initialState = {
    dots: [],
    yTickFormat: 1000000,
    yTickLabel: 'M',
    isTooltipOpen: false,
    tooltipTitle: '',
    tooltipValue: '',
    hoverX: 0,
    hoverY: 0,
  }

  state = {...this.initialState};

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData, width, height } = nextProps;

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
        ...d,
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

  handleHoverEnter = (x, y, title, gross) => {
    const formattedGross = d3.format(',')(gross);
    this.showTooltip(title, formattedGross, x, y);
  }

  handleHoverExit = (x, y) => {
    this.closeTooltip();
  }

  showTooltip = (title, value, x, y) => {
    this.setState({
      ...this.state,
      isTooltipOpen: true,
      tooltipTitle: title,
      tooltipValue: value,
      hoverX: x,
      hoverY: y,
    });
  }

  closeTooltip = () => {
    this.setState({
      ...this.state,
      isTooltipOpen: false,
      tooltipTitle: this.initialState.tooltipTitle,
      tooltipValue: this.initialState.tooltipValue,
    });
  }

  render() {
    const {
      dots,
      isTooltipOpen,
      tooltipTitle,
      tooltipValue,
      hoverX,
      hoverY,
    } = this.state;

    const { width, height } = this.props;

    return (
      <div className='output-chart'>
        <svg width={width} height={height}>
          {dots.map(d => (
            <circle
              cx={d.x}
              cy={d.y}
              r={3.5}
              fill={d.fill}
              onMouseOver={() => this.handleHoverEnter(d.x, d.y, d.title, d.lifetime_gross)}
              onMouseOut={() => this.handleHoverExit(d.x, d.y)}
            >
              <title>{d.title}</title>
            </circle>
          ))}
          <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </svg>
        {isTooltipOpen && <Tooltip title={tooltipTitle} gross={tooltipValue} x={hoverX} y={hoverY}  />}
      </div>
    );
  }
}

export default ScatterPlot;




