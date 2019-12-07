import * as React from 'react';
import './App.css';
import { getNearestDepth, getNearestTime, getPressureGroup, getPressureGroupForTableTwo } from './api/Utilities';
import DiveInputForm from './components/DiveInputForm';
import SurfaceIntervalForm from './components/SurfaceIntervalForm';
import { Container, Grid } from 'semantic-ui-react';
import { defaultNDLs, table3 } from './api/PadiTables';
import Swal from 'sweetalert2';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDives: 0,
      flag: false,
      dives: [],
      intervalInputs: [],
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
          'INPUTSET': false,
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
      ...dives[index],
      'DEPTH': parseInt(value, 10),
    };
    this.setState({ dives });
  };

  changeTimeInput = (event, { value }, index) => {
    event.preventDefault();
    let dives = [...this.state.dives];
    dives[index] = {
      ...dives[index],
      'TIME': parseInt(value, 10),
    };
    this.setState({ dives });
  };

  changeIntervalInput = (event, { value }, index) => {
    event.preventDefault();
    let intervalInputs = [...this.state.intervalInputs];
    intervalInputs[index] = {
      ...intervalInputs[index],
      'VALUE': parseInt(value, 10),
    };
    this.setState({ intervalInputs });
  };

  setDiveInput = (event, index) => {
    event.preventDefault();
    const { numberOfDives, intervalInputs } = this.state;
    let dives = [...this.state.dives];
    const dive = dives[index];
    const depthInput = dive["DEPTH"];
    const timeInput = dive["TIME"];
    const depth = getNearestDepth(depthInput);
    const time = getNearestTime(depthInput, timeInput);
    let ndl = 0;
    if (index === 0) {
      ndl = defaultNDLs[depth];
    } else
      if (numberOfDives > 1 && index !== 0 && index !== (numberOfDives - 1)) {
        const intervalInput = intervalInputs[index];
        const startPressureGroup = getPressureGroup(depth, time);
        const pressureGroupFromTableTwo = getPressureGroupForTableTwo(startPressureGroup, intervalInput);
        const nextDive = dives[index + 1];
        const nextDepthInput = nextDive["DEPTH"];
        const nextTimeInput = nextDive["TIME"];
        const nextDepth = getNearestDepth(nextDepthInput);
        const nextTime = getNearestTime(nextTimeInput);
        const rnt = table3[nextDepth][0]; // Residual Nitrogen Time
        const andl = table3[nextDepth][1]; // Adjusted No Decompression Limit
        ndl = andl;
        if (numberOfDives > 2) {
          const adjustedTime = nextTime + rnt;
        }
      }
    dives[index] = {
      'DEPTH': depth,
      'TIME': time,
      'NDL': ndl,
      'INPUTSET': true,
    };
    this.setState({ dives });
  };

  setIntervalInput = (event, index) => {
    event.preventDefault();
    let intervalInputs = [...this.state.intervalInputs];
    intervalInputs[index] = {
      ...intervalInputs[index],
      'INPUTSET': true,
    };
    this.setState({ intervalInputs });
  };

  render() {
    const { numberOfDives, intervalInputs } = this.state;

    const renderDiveColumns = () => {
      let forms = [];
      const { numberOfDives, dives, flag } = this.state;
      for (let i = 0; i < numberOfDives; i++) {
        forms.push(
            <React.Fragment key={i}>
              <Grid.Column>
                <b>Dive #{i}</b>
                {i === 0 ?
                    <DiveInputForm index={i} dives={dives}
                                   handleDepthChange={this.changeDepthInput}
                                   handleTimeChange={this.changeTimeInput}
                                   handleSubmit={this.setDiveInput}/>
                    :
                    (dives[i - 1] !== undefined && dives[i - 1]['INPUTSET'] && intervalInputs[i - 1] !== undefined && intervalInputs[i - 1]['INPUTSET']) ?
                        <DiveInputForm index={i} dives={dives}
                                       handleDepthChange={this.changeDepthInput}
                                       handleTimeChange={this.changeTimeInput}
                                       handleSubmit={this.setDiveInput}/>
                        : ''
                }

                {flag ?
                    <React.Fragment>
                      <div>NDL: {dives[i].NDL} minutes</div>
                    </React.Fragment> : ''}
              </Grid.Column>

              <Grid.Column>
                {(numberOfDives > 1 && i !== (numberOfDives - 1) && dives[i] !== undefined && dives[i]['INPUTSET']) ?
                    <SurfaceIntervalForm index={i} dives={dives}
                                         handleIntervalChange={this.changeIntervalInput}
                                         handleSubmit={this.setIntervalInput}/> : ''}
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
                </React.Fragment> : ''
            }
          </Container>
        </div>
    );
  }
}

export default App;
