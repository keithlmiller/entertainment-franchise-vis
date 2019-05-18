import React, { Component } from "react";
import * as d3 from "d3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../App.scss';
const width = 800;
const margin = { top: 20, right: 45, bottom: 20, left: 120 };
const collapsedHeight = 75;
const fullHeight = 200;

class RevenueLineChart extends Component {
  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();
  yAxisLines = d3.axisLeft();
  brush = d3.brushX();

  constructor(props) {
    super(props);
    this.state = {
        lines: [],
        displayMinYear: null,
        displayMaxYear: null,
        height: collapsedHeight,
        collapsed: true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData } = nextProps;
    const { height } = prevState;

    if (!visData) return {};

    const xScale = d3
      .scaleLinear()
      .domain([1999, 2017])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 500000000])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
        .x(d => xScale(parseInt(d.year)))
        .y(d => yScale(d.avgRevenue));

    return { ...prevState, line, xScale, yScale };
  }

  componentDidMount() {
    const { height, xScale } = this.state;
    const initialBrush = [xScale(2007), xScale(2017)]

    this.brush
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
      .on('end', this.brushmove);
    d3.select(this.refs.brush)
      .call(this.brush)
      .call(this.brush.move, initialBrush);

    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      xScale,
      yScale,
      height,
      x1, x2,
    } = this.state;

    const { height: prevHeight } = prevState;

    this.xAxis
      .scale(xScale)
      .tickFormat(d3.format("d"));
    d3.select(this.refs.xAxis).call(this.xAxis);

    this.yAxis
      .scale(yScale)
      .tickFormat(
        d => `$${parseInt((d) / 1000000)}M`
      );
    d3.select(this.refs.yAxis).call(this.yAxis);

    this.yAxisLines
      .scale(yScale)
      .tickSize(width - margin.left - margin.right);

    const yAxisLines = d3.select(this.refs.yAxisLines);

    yAxisLines
      .call(this.yAxisLines)
      .call(g => g.select('.domain').remove())
      .selectAll('text').remove()

    yAxisLines
      .selectAll('line')
      .attr('stroke', '#b3b3b3')
      .attr('stroke-dasharray', '2,2')

    if (height !== prevHeight) {
      const currentBrush = [x1, x2]
      this.brush
        .extent([
          [margin.left, margin.top],
          [width - margin.right, height - margin.bottom]
        ]);
      d3.select(this.refs.brush)
        .call(this.brush)
        .call(this.brush.move, currentBrush);
    }
    
  }

  brushmove = () => {
    const { updateRange } = this.props;
    if (!d3.event.selection) {
      updateRange();
      return;
    }
    const [x1, x2] = d3.event.selection;
    const range = [Math.round(this.state.xScale.invert(x1)), Math.round(this.state.xScale.invert(x2))];
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
    const { collapsed } = this.state;
    this.setState({
      ...this.state,
      height: collapsed ? fullHeight : collapsedHeight,
      collapsed: !collapsed,
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
                  <h3 className='timeline-title'>Average Revenue of Top Ten Movies</h3>
                  {!collapsed && <p className='timeline-description'>Click and drag to select a range of time to adjust the global date range</p>}
              </div>
            <div className='timeline-content'>
              <button className={`toggle-chart-height ${!collapsed ? 'collapse-chart' : ''}`} onClick={this.handleToggleHeight}>
                <FontAwesomeIcon icon='angle-down' />
              </button>
              
              <svg width={width} height={height}>
                  {!collapsed && <g ref="yAxisLines" className='background-lines' transform={`translate(${width - margin.right}, 0)`} />}

                  <path fill='none' stroke='#4da000' stroke-width={1.5} d={line(visData)} />))
                  {displayMinYear && <text x={this.getBrushLabelPos(x1, 'left')} y={height/4} className='year-text'>{displayMinYear}</text>}
                  <g ref='brush' />
                  {displayMaxYear && <text x={this.getBrushLabelPos(x2, 'right')} y={height/4} className='year-text'>{displayMaxYear}</text>}
                  <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
                  {!collapsed && <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />}
              </svg>
            </div>
        </div>
      
    );
  }
}

export default RevenueLineChart;
