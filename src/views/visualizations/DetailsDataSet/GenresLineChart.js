import React, { Component } from "react";
import * as d3 from "d3";
import '../../App.css';
const width = 800;
const margin = { top: 20, right: 45, bottom: 20, left: 45 };

class LineChart extends Component {
  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  constructor(props) {
    super(props);
    this.state = {
        displayMinYear: null,
        displayMaxYear: null,
        height: 200,
        collapsed: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData } = nextProps;
    const { height } = prevState;

    if (!visData) return {};
    const xExtent = d3.extent(visData, d => d.year);
    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);

    const [yMin, yMax] = d3.extent(visData, d => d.numMovies);
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
        .x(d => xScale(parseInt(d.year)))
        .y(d => yScale(d.numMovies));

    return { ...prevState, line, xScale, yScale };
  }

  componentDidMount() {
    const { height } = this.state;

    this.brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
      .on("end", this.brushmove);
    d3.select(this.refs.brush)
      .call(this.brush)
      .call(this.brush.move, [margin.left, 100]);

    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
  }

  componentDidUpdate() {
    const {
      xScale,
      yScale,
    } = this.state;
    this.xAxis
      .scale(xScale)
      .tickFormat(d3.format("d"));
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis
      .scale(yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  brushmove = () => {
    // wip
    const { updateRange } = this.props;
    if (!d3.event.selection) {
      updateRange();
      return;
    }
    const [x1, x2] = d3.event.selection;
    const range = [this.state.xScale.invert(x1), this.state.xScale.invert(x2)];
    const [minYear, maxYear] = range;
    const displayMinYear = Math.floor(minYear);
    const displayMaxYear = Math.floor(maxYear);
    this.setState({
        ...this.state,
        x1, x2,
        displayMinYear,
        displayMaxYear,
    });

    updateRange(range);
  }

  getBrushLabelPos = (brushX, defaultPos = 'left') => {
    const leftLabel = brushX - 40;
    const rightLabel = brushX + 10;
    const isLeftDefault = defaultPos === 'left';
    const atRightEdge = brushX > width - 90;
    const atLeftEdge = brushX < 90;

    if (isLeftDefault) {
        return atLeftEdge ? rightLabel : leftLabel;
    } else {
        return atRightEdge ? leftLabel : rightLabel;
    }
  }

  handleToggleHeight = () => {
    this.setState({
      ...this.state,
      height: this.state.height === 200 ? 75 : 200,
      collapsed: !this.state.collapsed,
    })
  }

  render() {
    const {
      height,
      collapsed,
      line,
      x1, 
      x2,
      displayMinYear,
      displayMaxYear,
    } = this.state;

    const {
        visData,
        fixedBottom,
    } = this.props;

    return (
        <div
          className={`brush-timeline ${fixedBottom ? 'timeline-fixed' : 'timeline-standard'} ${collapsed ? 'timeline-collapsed' : ''}`}>
            <div className='timeline-explanation'>
                <h3 className='timeline-title'>Movies Released Per Year</h3>
                {!collapsed && <p className='timeline-description'>Click and drag to select a range of time to explore with the graphs above</p>}
            </div>

            <button className='toggle-chart-height' onClick={this.handleToggleHeight}>Toggle Height</button>
            
            <svg width={width} height={height}>
                <path fill='none' stroke='#f4f4f4' stroke-width={1.5} d={line(visData)} />
                {displayMinYear && <text x={this.getBrushLabelPos(x1, 'left')} y={height/4} className='year-text'>{displayMinYear}</text>}
                <g ref="brush" />
                {displayMaxYear && <text x={this.getBrushLabelPos(x2, 'right')} y={height/4} className='year-text'>{displayMaxYear}</text>}
                <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
                <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
            </svg>
        </div>
      
    );
  }
}

export default LineChart;