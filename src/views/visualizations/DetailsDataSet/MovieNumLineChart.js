import React, { Component } from "react";
import * as d3 from "d3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../../App.scss';
const width = 800;
const margin = { top: 20, right: 45, bottom: 20, left: 120 };

class MovieNumLineChart extends Component {
  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();
  yAxisLines = d3.axisLeft();

  constructor(props) {
    super(props);
    this.state = {
        lines: [],
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

    const rangeNames = visData.map(range => range.rangeName);
    // const xExtent = d3.extent(visData, d => d.year);
    const xScale = d3
      .scaleLinear()
      .domain([1999, 2017])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 10])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(rangeNames)
      // pink, green, purple
      .range([
        "#e683b4", 
        "#53c3ac", 
        "#8475e8",
      ]);
      
    const line = d3.line()
        .x(d => xScale(parseInt(d.year)))
        .y(d => yScale(d.numMovies));

    return { ...prevState, line, xScale, yScale, colorScale};
  }

  componentDidMount() {
    const { height, xScale } = this.state;
    const initialBrush = [xScale(2007), xScale(2017) ]

    this.brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
      .on("end", this.brushmove);
    d3.select(this.refs.brush)
      .call(this.brush)
      .call(this.brush.move, initialBrush);

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
  }

  brushmove = () => {
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
      colorScale,
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
            <button className={`toggle-chart-height ${!this.state.collapsed ? 'collapse-chart' : ''}`} onClick={this.handleToggleHeight}>
              <FontAwesomeIcon icon='angle-down' />
            </button>
            
            <div className='timeline-explanation'>
                <h3 className='timeline-title'>Blockbusters Per Year Per Date Range</h3>
                {!collapsed && <p className='timeline-description'>Click and drag to select a range of time to explore with the graphs above</p>}
            </div>

            
            <svg width={width} height={height}>
                <g ref="yAxisLines" className='background-lines' transform={`translate(${width - margin.right}, 0)`} />

                {visData.map((range) => (<path fill='none' stroke={colorScale(range.rangeName)} stroke-width={1.5} d={line(range.data)} />)) }
                {visData.map((range, i) => (
                  <g className='timeline-legend' width={100} height={50}>
                    <rect fill={colorScale(range.rangeName)} width={20} height={20} x={0} y={(i+1)*50} />
                    <text x={25} y={(i+1)*50 + 15} fill='black' className='timeline-legend-text'>{range.rangeName}</text>
                  </g>
                )) }
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

export default MovieNumLineChart;
