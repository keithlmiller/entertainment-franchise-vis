import React, { Component } from "react";
import * as d3 from "d3";
import ChartTitle from '../../../components/ChartTitle/ChartTitle';
import Tooltip from '../../../components/Tooltip/Tooltip';
const margin = { top: 20, right: 15, bottom: 20, left: 45 };

class ExtendedScatterPlot extends Component {
  initialState = {
    dots: [],
    yTickFormat: 1000000,
    yTickLabel: 'M',
    isTooltipOpen: false,
    tooltipTitle: '',
    tooltipValue: '',
    tooltipYear: '',
    tooltipScore: 0,
    hoverX: 0,
    hoverY: 0,
  }

  state = {...this.initialState};

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData, width, height } = nextProps;

    if (!visData) return {};

    // const xExtent = d3.extent(visData, d => d.metascore);
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const [yMin, yMax] = d3.extent(visData, d => d.boxOffice);
    const yTickFormat = yMax >= 1000000 ? 1000000 : 1000;
    const yTickLabel = yMax >= 1000000 ? 'M' : 'k';
    const yScale = d3
      .scaleLinear()
      .domain([0, 1000000000])
      .range([0, height - margin.bottom - margin.top]);
    const yAxisScale = d3
      .scaleLinear()
      .domain([0, 1000000000])
      .range([height - margin.bottom, margin.top]);

    const dots = visData.map(d => {
      return {
        x: xScale(d.metascore),
        y: height - yScale(d.boxOffice) - margin.bottom,
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
      .tickFormat(d => `${d}%`);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis
      .scale(yAxisScale)
      .tickFormat(
        d => `$${parseInt((d) / yTickFormat)}${yTickLabel}`
      );
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  handleHoverEnter = (x, y, title, gross, metascore) => {
    const formattedGross = d3.format(',')(gross);
    this.showTooltip(title, formattedGross, metascore, x, y);
    // TODO: add hover state to dot
    // show hovered movie on other charts
  }

  handleHoverExit = () => {
    this.closeTooltip();
  }

  showTooltip = (title, value, metascore, x, y) => {
    this.setState({
      ...this.state,
      isTooltipOpen: true,
      tooltipTitle: title,
      tooltipValue: value,
      tooltipScore: metascore,
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
      tooltipYear,
      tooltipScore,
      hoverX,
      hoverY,
    } = this.state;

    const { 
      width, 
      height,
      chartTitle,
    } = this.props;

    return (
      <div className='chart-container primary-chart'>
        <ChartTitle title={chartTitle} />
        <div className='chart-container'>
          <svg width={width} height={height}>
            {dots.map(d => (
              <circle
                cx={d.x}
                cy={d.y}
                r={5}
                onMouseOver={() => this.handleHoverEnter(d.x, d.y, d.title, d.boxOffice, d.metascore)}
                onMouseOut={() => this.handleHoverExit()}
                className='scatter-dot chart-standard-fg'
              ></circle>
            ))}
            <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
            <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
          </svg>
          {isTooltipOpen && <Tooltip title={tooltipTitle} gross={tooltipValue} year={tooltipYear} score={tooltipScore} x={hoverX} y={hoverY}  />}
        </div>
      </div>
    );
  }
}

export default ExtendedScatterPlot;




