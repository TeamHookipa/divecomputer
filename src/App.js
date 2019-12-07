import * as React from 'react';
import './App.css';
import { getNearestDepth, getNearestTime, getPressureGroupForTableTwo, getPressureGroup } from './api/Utilities';
import DiveInputForm from './components/DiveInputForm';
import SurfaceIntervalForm from './components/SurfaceIntervalForm';
import { Button, Container, Grid, Input } from 'semantic-ui-react';
import { defaultNDLs, table3 } from './api/PadiTables';
import Swal from 'sweetalert2';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDives: 0,
      flag: false,
      dives: [],
      NDL: [],
    }
  }

  initializeNumberOfDives = () => {
    const numberOfDivesInputValue = parseInt(document.getElementById("numberOfDives").value, 10);
    if (numberOfDivesInputValue < 1) {
      Swal.fire({
        title: 'Invalid Number of Dives',
        icon: 'error',
        type: 'error',
        text: 'You must enter between 1-8 number of dives',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } else
      if (numberOfDivesInputValue > 8) {
        Swal.fire({
          title: 'Invalid Number of Dives',
          icon: 'error',
          type: 'error',
          text: 'More than 8 number of dives is not supported',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      } else {
        this.setState({ numberOfDives: numberOfDivesInputValue });
        let initialDive = {
          'DEPTH': undefined,
          'TIME': undefined,
          'NDL': undefined,
        };
        for (let i = 0; i < this.state.numberOfDives; i++) {
          this.setState(prevState => ({ dives: [...prevState.dives, initialDive] }));
        }
      }
  };

  changeDepthInput = (event, { value }, index) => {
    event.preventDefault();
    let dives = [...this.state.dives];
    dives[index] = {
      'DEPTH': parseInt(value, 10),
    };
    this.setState({ dives });
  };

  setDiveInputs = () => {
    const { numberOfDives } = this.state;
    this.setState({ flag: true });
    for (let i = 0; i < numberOfDives; i++) {
      const depthInput = parseInt(document.getElementById(`depthInput${i}`).value, 10);
      const timeInput = parseInt(document.getElementById(`timeInput${i}`).value, 10);
      const depth = getNearestDepth(depthInput);
      const time = getNearestTime(depthInput, timeInput);
      let ndl = 0;
      if (numberOfDives === 1 && i === 0) {
        ndl = defaultNDLs[depth];
      } else
        if (numberOfDives > 1 && i !== (numberOfDives - 1)) {
          const intervalInput = parseInt(document.getElementById(`intervalInput${i}`).value, 10);
          const startPressureGroup = getPressureGroup(depth, time);
          const pressureGroupFromTableTwo = getPressureGroupForTableTwo(startPressureGroup, intervalInput);
          const nextDepthInput = parseInt(document.getElementById(`depthInput${i + 1}`).value, 10);
          const nextTimeInput = parseInt(document.getElementById(`timeInput${i + 1}`).value, 10);
          const nextDepth = getNearestDepth(nextDepthInput);
          const nextTime = getNearestTime(nextTimeInput);
          const rnt = table3[nextDepth][0]; // Residual Nitrogen Time
          const andl = table3[nextDepth][1]; // Adjusted No Decompression Limit
          ndl = andl;
          console.log('ndl ', ndl);
          if (numberOfDives > 2) {
            const adjustedTime = nextTime + rnt;
          }
        }
      const diveInfo = {
        'DEPTH': depth,
        'TIME': time,
        'NDL': ndl,
      };
      this.setState(prevState => ({ dives: [...prevState.dives, diveInfo] }));
    }
  };

  render() {
    const { numberOfDives, dives } = this.state;

    const renderDiveColumns = () => {
      let forms = [];
      const { numberOfDives, dives, flag } = this.state;
      for (let i = 0; i < numberOfDives; i++) {
        forms.push(
            <React.Fragment key={i}>
              <Grid.Column>
                <DiveInputForm index={i} dives={dives} handleDepthChange={this.changeDepthInput}
                               handleSubmit={this.setDiveInputs}/>
                {flag ?
                    <React.Fragment>
                      <div>NDL: {dives[i].NDL} minutes</div>
                    </React.Fragment> : ''}
              </Grid.Column>
              <Grid.Column>
                {// Render Surface Interval Input Forms
                  (numberOfDives > 1 && i !== (numberOfDives - 1)) ?
                      <SurfaceIntervalForm index={i}/>
                      : ''
                }
              </Grid.Column>
            </React.Fragment>
        );
      }
      return forms;
    };

    return (
        <div className="main">
          <Container className="App">
            <h1><b>DISCLAIMER: THIS CODE IS FOR PROTOTYPING PURPOSES ONLY, DO NOT USE TO PLAN FOR A REAL DIVE</b></h1>

            <label htmlFor="numberOfDives"># of Dives</label>
            <input type="number" id="numberOfDives" name="numberOfDives"/>
            <button type="button" onClick={this.initializeNumberOfDives}>Plan Out Your Dive!</button>
            {numberOfDives > 0 ?
                <React.Fragment>
                  {/* # of Columns: # of dives + # of surface interval columns */}
                  <Grid columns={numberOfDives + (numberOfDives - 1)}>
                    {renderDiveColumns()}
                  </Grid>
                  <button type="button" onClick={this.setDiveInputs}>Set Dive</button>
                </React.Fragment> : ''
            }
          </Container>
        </div>
    );
  }
}

export default App;
