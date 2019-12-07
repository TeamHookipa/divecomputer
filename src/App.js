import * as React from 'react';
import './App.css';
import {
  getNearestDepth,
  getNearestTime,
  getPressureGroup,
  getPressureGroupForTableTwo,
  isSafetyStopRequired
} from './api/Utilities';
import DiveInputForm from './components/DiveInputForm';
import SurfaceIntervalForm from './components/SurfaceIntervalForm';
import { Container, Grid, Message, Header, List } from 'semantic-ui-react';
import { defaultNDLs, table3 } from './api/PadiTables';
import Swal from 'sweetalert2';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDives: 0,
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
          'PG': undefined,
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
    const { intervalInputs } = this.state;
    let dives = [...this.state.dives];
    const dive = dives[index];
    const depthInput = dive["DEPTH"];
    const timeInput = dive["TIME"];
    const depth = getNearestDepth(depthInput);
    const time = getNearestTime(depthInput, timeInput);
    let ndl;
    if (index === 0) {
      ndl = defaultNDLs[depth];
    } else {
      const intervalInput = intervalInputs[index - 1]['VALUE'];
      const startPressureGroup = dives[index - 1]['PG'];
      const pressureGroupFromTableTwo = getPressureGroupForTableTwo(startPressureGroup, intervalInput);
      const rnt = table3[depth][pressureGroupFromTableTwo][0]; // Residual Nitrogen Time
      const andl = table3[depth][pressureGroupFromTableTwo][1]; // Adjusted No Decompression Limit
      ndl = andl;
    }
    if (time > ndl) {
      Swal.fire({
        title: 'No Decompression Limit Exceeded',
        icon: 'error',
        type: 'error',
        text: `Your TIME input of ${time} minutes for Dive ${index} has exceeded the No Decompression Limit of ${ndl} minutes!`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      return false;
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
    let dives = [...this.state.dives];
    const depth = dives[index]["DEPTH"];
    const time = dives[index]["TIME"];
    const pressureGroup = getPressureGroup(depth, time);
    dives[index] = {
      ...dives[index],
      'PG': pressureGroup,
    };
    this.setState({ dives, intervalInputs });
  };

  render() {
    const { numberOfDives, intervalInputs } = this.state;

    const renderDiveColumns = () => {
      let forms = [];
      const { numberOfDives, dives } = this.state;
      for (let i = 0; i < numberOfDives; i++) {
        forms.push(
            <React.Fragment key={i}>
              <Grid.Column>
                <Header>Dive #{i}</Header>
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
                {(dives[i] !== undefined && dives[i]['INPUTSET']) ?
                    <Message>
                      <Message.Header>No Decompression Limit: </Message.Header>
                      {dives[i].NDL} minutes
                    </Message> : ''}
              </Grid.Column>

              <Grid.Column>
                {(numberOfDives > 1 && i !== (numberOfDives - 1) && dives[i] !== undefined && dives[i]['INPUTSET']) ?
                    <React.Fragment>
                      <Header>Surface Interval</Header>
                      <SurfaceIntervalForm index={i} dives={dives}
                                           handleIntervalChange={this.changeIntervalInput}
                                           handleSubmit={this.setIntervalInput}/>
                      {(dives[i]['DEPTH'] >= 30 || isSafetyStopRequired(dives[i]['DEPTH'], dives[i]['TIME'])) ?
                          // TODO: Move to its own component
                          <Message negative={true}>
                            <Message.Header>SAFETY STOP REQUIRED AFTER DIVE #{i}</Message.Header>
                            Safety stops are REQUIRED for dive depths of 30 meters or deeper OR if the pressure group
                            for the dive is within three pressure groups of its no decompression limit.
                            <List bulleted={true}>
                              <List.Header>Dive #{i} Statistics</List.Header>
                              <List.Item>Depth: {dives[i]['DEPTH']} meters</List.Item>
                              <List.Item>
                                Pressure Group Achieved: {getPressureGroup(dives[i]['DEPTH'], dives[i]['TIME'])}
                              </List.Item>
                              <List.Item>
                                Pressure Group of
                                NDL: {getPressureGroup(dives[i]['DEPTH'], defaultNDLs[dives[i]['DEPTH']])}
                              </List.Item>
                            </List>
                          </Message>
                          :
                          <Message warning={true}>
                            <Message.Header>Safety Stop Recommended after Dive #{i}</Message.Header>
                            A safety stop is recommended 5 meters below surface for 3 to 5 minutes before surfacing at
                            the end of all dives.
                          </Message>
                      }
                    </React.Fragment> : ''}
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

            <label htmlFor="numberOfDives"><h2># of Dives </h2></label>
            <input type="number" id="numberOfDives" name="numberOfDives"/>
            <button type="button" onClick={this.initializeNumberOfDives}>Plan Out Your Dive!</button>
            <br/><br/>
            {numberOfDives > 0 ?
                // TODO: Rows of 6
                // TODO: Show current pressure group
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
