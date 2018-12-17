import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import BarChart from './views/visualizations/BarChart';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        data: [],
    };
  }

  componentWillMount() {
    let boxOfficeData = [];
    d3.csv(data,
      (data) => {
        boxOfficeData.push(data);
      }
    ).then(() => {
      // console.log('boxOfficeData', boxOfficeData);

      const firstTen = boxOfficeData.slice(0, 5)

      console.log('firstTen', firstTen);
      this.setState({ data: firstTen })
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <BarChart data={this.state.data}/>

        </header>
      </div>
    );
  }
}

export default App;
