import * as React from 'react';
import './App.css';
import {
  getMinimumSurfaceInterval,
  getNearestDepth,
  getNearestTime,
  getPressureGroup,
  getPressureGroupForTableTwo, isDefined,
  isSafetyStopRequired
} from './api/Utilities';
import DiveInputForm from './components/DiveInputForm';
import SurfaceIntervalForm from './components/SurfaceIntervalForm';
import { Container, Grid, Message, Header, Modal, Table, Popup, Button, Icon } from 'semantic-ui-react';
import { defaultNDLs, table3 } from './api/PadiTables';
import Swal from 'sweetalert2';
import SafetyStopIndicator from './components/SafetyStopIndicator';
import NumberOfDivesInputForm from './components/NumberOfDivesInputForm';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDives: 0,
      numberOfDivesFlag: false,
      divesPerRow: 3,
      dives: [],
      // Dive Object Schema:
      // 'DEPTH': Number,
      // 'TIME': Number,
      // 'NDL': Number,
      // 'RNT': Number,
      // 'INPUTSET': Boolean,
      // 'PG': String,
      intervalInputs: [],
      // Multiple Dives Rule
      oneHourMinSurfaceIntervalFlag: false,
      threeHourMinSurfaceIntervalFlag: false,
      disabled: true,
    }
  }

  // Since arrays start at 0, first element is called "0" if we access it directly. This function increments that. ONLY for
  // UI purposes, this should not be used for any functionality as it will mess up the logic very badly.
  incrementIndex = (index) => index + 1;

  changeNumberOfDives = (event, { value }) => {
    event.preventDefault();
    this.setState({ numberOfDives: parseInt(value, 10) });
  };

  setNumberOfDives = (event) => {
    event.preventDefault();
    const { numberOfDives } = this.state;
    this.setState({ numberOfDivesFlag: true });
    if (numberOfDives < 1) {
      Swal.fire({
        title: 'Invalid Number of Dives',
        icon: 'error',
        type: 'error',
        text: 'You must enter between 1-8 number of dives',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } else {
      this.setState({ numberOfDives: numberOfDives });
    }
    document.getElementById("numberOfDivesInputForm").style.display = "none";
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
    // Multiple Dives Rule
    // If Pressure Group is W or X, all subsequent dives must have a minimum surface interval of 60 minutes
    // If Pressure Group is Y or Z, all subsequent dives must have a minimum surface interval of 180 minutes
    let dives = [...this.state.dives];
    if (index !== 0) {
      const prevDive = dives[index - 1];
      const prevDepth = prevDive["DEPTH"];
      const prevTime = prevDive["TIME"];
      const pressureGroupOfPrevDive = getPressureGroup(prevDepth, prevTime);
      if (pressureGroupOfPrevDive === 'W' || pressureGroupOfPrevDive === 'X') {
        this.setState({ oneHourMinSurfaceIntervalFlag: true });

      } else
        if (pressureGroupOfPrevDive === 'Y' || pressureGroupOfPrevDive === 'Z') {
          this.setState({ threeHourMinSurfaceIntervalFlag: true });
        }
    }

    const dive = dives[index];
    const depthInput = dive["DEPTH"];
    const timeInput = dive["TIME"];
    const depth = getNearestDepth(depthInput);
    if (index !== 0) {
      // Multiple Dives Rule: Limit all repetitive dives to 30 meters or less
      if (depth > 30) {
        Swal.fire({
          title: 'Multiple Dives Rule',
          icon: 'error',
          type: 'error',
          text: 'Repetitive dives are limited to 30 meters or less',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        return false;
      }
      // Multiple Dives Rule: Repetitive dives should be the same or lesser depth than the dive preceding
      if (depth > dives[index - 1]['DEPTH']) {
        Swal.fire({
          title: 'Multiple Dives Rule',
          icon: 'error',
          type: 'error',
          html: `<p>Repetitive dives should be the same or a lesser depth than the dive preceding</p>
                 <p>Dive #${this.incrementIndex(index)} Depth: ${depth} meters</p>
                 <p>Dive #${this.incrementIndex(index - 1)} Depth: ${dives[index - 1]['DEPTH']}</p>`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        return false;
      }
    }
    const time = getNearestTime(depthInput, timeInput);
    let ndl;
    if (index === 0) { // Only in the first dive we calculate the NDL here rather than in setIntervalInput()
      ndl = defaultNDLs[depth];
    }
    if (time > ndl) {
      Swal.fire({
        title: 'No Decompression Limit Exceeded',
        icon: 'error',
        type: 'error',
        text: `Your TIME input of ${time} minutes for Dive ${this.incrementIndex(index + 1)} has exceeded the No Decompression Limit of ${ndl} minutes!`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      return false;
    }
    // In any repetitive dive, we make sure that they have a valid surface interval first (handled in setIntervalInput())
    // before they are allowed to input the next dives.
    let inputSetFlag = false;
    if (index === 0) inputSetFlag = true; // Therefore only the first dive can bypass this rule
    dives[index] = {
      'DEPTH': depth,
      'TIME': time,
      'NDL': ndl,
      'INPUTSET': inputSetFlag,
    };
    this.setState({ dives });

    this.enableOverview();
  };

  setIntervalInput = (event, index) => {
    event.preventDefault();
    // Check minimum surface interval is valid first
    let dives = [...this.state.dives];
    const prevDive = dives[index];
    const prevDepth = prevDive["DEPTH"];
    const prevTime = prevDive["TIME"];
    const pressureGroupOfPrevDive = getPressureGroup(prevDepth, prevTime);
    const nextDepth = dives[index + 1]['DEPTH'];
    const nextTime = dives[index + 1]['TIME'];
    const { oneHourMinSurfaceIntervalFlag, threeHourMinSurfaceIntervalFlag } = this.state;
    let minSurfaceInterval;
    if (oneHourMinSurfaceIntervalFlag) {
      minSurfaceInterval = 60;
    } else
      if (threeHourMinSurfaceIntervalFlag) {
        minSurfaceInterval = 180
      } else {
        minSurfaceInterval = getMinimumSurfaceInterval(pressureGroupOfPrevDive, nextDepth, nextTime);
      }
    console.log('minSurfaceInterval ', minSurfaceInterval);
    let intervalInputs = [...this.state.intervalInputs];
    if (intervalInputs[index]['VALUE'] < minSurfaceInterval) {
      Swal.fire({
        title: 'Minimum Surface Interval Required',
        icon: 'error',
        type: 'error',
        text: `In order to do Dive #${this.incrementIndex(index + 1)} of ${nextDepth} meters and ${nextTime} minutes, Surface Interval ${index} must be at least ${minSurfaceInterval} minutes `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      return false;
    }
    // If valid,
    // * Update the state to set the surface intervals
    intervalInputs[index] = {
      ...intervalInputs[index],
      'INPUTSET': true,
    };
    // * Add a pressure group 'PG' key-value pair for the previous dive
    dives[index] = {
      ...dives[index],
      'PG': pressureGroupOfPrevDive,
    };
    this.setState({ dives, intervalInputs });
    // * Calculate the RNT and ANDL for the next dive
    const intervalInput = intervalInputs[index]['VALUE'];
    const startPressureGroup = dives[index]['PG'];
    const pressureGroupFromTableTwo = getPressureGroupForTableTwo(startPressureGroup, intervalInput);
    const rnt = table3[nextDepth][pressureGroupFromTableTwo][0]; // Residual Nitrogen Time
    const andl = table3[nextDepth][pressureGroupFromTableTwo][1]; // Adjusted No Decompression Limit
    const tbt = rnt + nextTime; // Total Bottom Time
    if (tbt > andl) {
      Swal.fire({
        title: 'No Decompression Limit Exceeded',
        icon: 'error',
        type: 'error',
        html: `<p>Your total bottom time in Dive #${this.incrementIndex(index + 1)} of ${tbt} minutes exceeded the No Decompression Limit for Dive #${this.incrementIndex(index + 1)}</p>
               <p>No Decompression Limit (for Dive #${this.incrementIndex(index)}): ${andl} minutes</p>
               <p>Residual Nitrogen Time (from Dive #${this.incrementIndex(index)}): ${rnt} minutes</p>
               <p>Actual Bottom Time (of Dive #${this.incrementIndex(index + 1)}): ${nextTime} minutes</p>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      intervalInputs[index] = {
        ...intervalInputs[index],
        'INPUTSET': false,
      };
      return false;
    }
    // * Set the NDL and INPUTSET for the next dive
    dives[index + 1] = {
      ...dives[index + 1],
      'NDL': andl,
      'RNT': rnt,
      'INPUTSET': true,
    };
    this.setState({ dives, intervalInputs });
  };

  enableOverview = () => {
    this.setState({ disabled: false});
  }

  render() {
    const { numberOfDives, divesPerRow, intervalInputs, numberOfDivesFlag } = this.state;

    const DiveOverviewTable = () => (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Dive #</Table.HeaderCell>
              <Table.HeaderCell>Depth</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>NDL</Table.HeaderCell>
              <Table.HeaderCell>ABT</Table.HeaderCell>
              <Table.HeaderCell>RNT</Table.HeaderCell>
              <Table.HeaderCell>TBT</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {renderDiveTable()}
          </Table.Body>
        </Table>
    );

    const renderDiveTable = () => {
      let cells = [];
      const { dives } = this.state;
      for (let i = 0; i < dives.length; i++) {
        cells.push(
            <React.Fragment key={i}>
              {dives.length > 0 ?
                  <React.Fragment>
                    {(numberOfDives > 1 && (dives[i]['DEPTH'] >= 30 || isSafetyStopRequired(dives[i]['DEPTH'], dives[i]['TIME']))) ?
                        <Popup content='Safety Stop REQUIRED' position='left center' basic trigger={
                          <Table.Row error>
                            <Table.Cell>{i + 1}</Table.Cell>
                            <Table.Cell>{dives[i]["DEPTH"]} meters</Table.Cell>
                            <Table.Cell>{dives[i]["TIME"]} minutes</Table.Cell>
                            <Table.Cell>{dives[i]["NDL"]} minutes</Table.Cell>
                            <Table.Cell>{dives[i]["TIME"]} minutes</Table.Cell>
                            <Table.Cell>{(i !== 0 ? dives[i]["RNT"] : 0)} minutes</Table.Cell>
                            <Table.Cell>{(i !== 0 ? dives[i]["TIME"] + dives[i]["RNT"] : dives[i]["TIME"])} minutes</Table.Cell>
                          </Table.Row>
                        }/>
                        :
                        <Table.Row>
                          <Table.Cell>{i + 1}</Table.Cell>
                          <Table.Cell>{dives[i]["DEPTH"]} meters</Table.Cell>
                          <Table.Cell>{dives[i]["TIME"]} minutes</Table.Cell>
                          <Table.Cell>{dives[i]["NDL"]} minutes</Table.Cell>
                          <Table.Cell>{dives[i]["TIME"]} minutes</Table.Cell>
                          <Table.Cell>{(i !== 0 ? dives[i]["RNT"] : 0)} minutes</Table.Cell>
                          <Table.Cell>{(i !== 0 ? dives[i]["TIME"] + dives[i]["RNT"] : dives[i]["TIME"])} minutes</Table.Cell>
                        </Table.Row>
                    }
                  </React.Fragment>
                  : ' '}
            </React.Fragment>
        )
      }
      return cells;
    };

    const DiveOverviewModal = () => (
        <Modal trigger={<Button {...this.state} type="ui button" color="black">Dive Overview</Button>} centered={false}>
          <Modal.Header>Dive Overview <Popup content="Values include changed values, not actual inputs" trigger={<Icon name="attention"/>}/></Modal.Header>
          <Modal.Content>
            <DiveOverviewTable/>
          </Modal.Content>
        </Modal>
    );

    const renderDiveGrids = () => {
      let grids = [];
      const { numberOfDives, numberOfDivesFlag, divesPerRow } = this.state;
      const numberOfGrids = Math.ceil(numberOfDives / divesPerRow);
      const multipleOfDivesPerRow = numberOfDives % divesPerRow === 0;
      let index = -divesPerRow; // The index of all the dives need to be keep tracked and passed on to the next grid
      // If the number of dives is a multiple of the dives per row setting, then it is guaranteed all the columns
      // for each grid is filled properly
      if (numberOfDivesFlag && multipleOfDivesPerRow) {
        const surfaceIntervalsPerRow = divesPerRow - 1;
        const numberOfColumns = divesPerRow + surfaceIntervalsPerRow + 1; // We add an extra column for the last surface interval of the row
        for (let i = 0; i < numberOfGrids; i++) {
          index = index + divesPerRow;
          if (i !== (numberOfGrids - 1)) {
            grids.push(
                <Grid key={i} columns={numberOfColumns}>
                  {renderDiveColumns(index, divesPerRow)}
                </Grid>
            )
          } else {
            grids.push(
                <Grid key={i} columns={numberOfColumns - 1}>
                  {renderDiveColumns(index, divesPerRow)}
                </Grid>
            )
          }
        }
      } else
        if (numberOfDivesFlag && !multipleOfDivesPerRow) {
          for (let i = 0; i < numberOfGrids; i++) {
            // We fill all the Grids that can have 4 dives first, which is all the grids except the last
            index = index + divesPerRow;
            if (i !== (numberOfGrids - 1)) {
              const surfaceIntervalsPerRow = divesPerRow - 1;
              const numberOfColumns = divesPerRow + surfaceIntervalsPerRow + 1;
              grids.push(
                  <Grid key={i} columns={numberOfColumns}>
                    {renderDiveColumns(index, divesPerRow)}
                  </Grid>
              )
            } else {
              const remainingDives = numberOfDives % divesPerRow;
              const surfaceIntervalsPerRow = remainingDives - 1;
              const numberOfColumns = remainingDives + surfaceIntervalsPerRow;
              grids.push(
                  <Grid key={i} columns={numberOfColumns}>
                    {renderDiveColumns(index, (numberOfDives % divesPerRow))}
                  </Grid>
              )
            }
          }
        }
      return grids;
    };

    const renderDiveColumns = (startingIndex, upperBound) => {
      let forms = [];
      const { numberOfDives, dives } = this.state;
      for (let i = startingIndex; i < (startingIndex + upperBound); i++) {
        forms.push(
            <React.Fragment key={i}>
              <Grid.Column>
                <Header>Dive #{this.incrementIndex(i)}</Header>
                {i === 0 ?
                    <DiveInputForm index={i}
                                   handleDepthChange={this.changeDepthInput}
                                   handleTimeChange={this.changeTimeInput}
                                   handleSubmit={this.setDiveInput}/>
                    :
                    (isDefined(dives[i - 1]) && dives[i - 1]['INPUTSET']) ?
                        <DiveInputForm index={i}
                                       handleDepthChange={this.changeDepthInput}
                                       handleTimeChange={this.changeTimeInput}
                                       handleSubmit={this.setDiveInput}/> : ''}
                {(
                    (isDefined(dives[i]) && dives[i]['INPUTSET'])
                    ||
                    (isDefined(dives[i]) && i === (numberOfDives - 1) && isDefined(intervalInputs[i - 1]) && intervalInputs[i - 1]['INPUTSET'])
                ) ?
                    <Message>
                      <Message.Header>No Decompression Limit: </Message.Header>
                      {dives[i]['NDL']} minutes
                      {i !== 0 ?
                          <React.Fragment>
                            <Message.Header>Total Bottom Time:</Message.Header>
                            {dives[i]['RNT'] + dives[i]['TIME']} minutes
                            <Message.Header>Residual Nitrogen Time:</Message.Header>
                            {dives[i]['RNT']} minutes
                            <Message.Header>Actual Bottom Time:</Message.Header>
                            {dives[i]['TIME']} minutes
                          </React.Fragment> : ''}
                    </Message> : ''}
              </Grid.Column>

              <Grid.Column>
                {(numberOfDives > 1 && i !== (numberOfDives - 1) && isDefined(dives[i]) && dives[i]['INPUTSET']) ?
                    <React.Fragment>
                      <Header>Surface Interval</Header>
                      <SurfaceIntervalForm index={i} dives={dives}
                                           handleIntervalChange={this.changeIntervalInput}
                                           handleSubmit={this.setIntervalInput}/>
                      {isSafetyStopRequired(dives[i]['DEPTH'], dives[i]['TIME']) ?
                          <SafetyStopIndicator index={i} depth={dives[i]['DEPTH']} time={dives[i]['TIME']}
                                               isNegative={true}/> :
                          <SafetyStopIndicator index={i} depth={dives[i]['DEPTH']} time={dives[i]['TIME']}
                                               isNegative={false}/>}
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
            <br/>
            <Message icon={'warning sign'}
                     negative={true}
                     header={'DISCLAIMER: THIS CODE IS FOR PROTOTYPING PURPOSES ONLY, DO NOT USE TO PLAN FOR A REAL DIVE'}/>
            <NumberOfDivesInputForm handleNumberOfDiveChange={this.changeNumberOfDives}
                                    handleSubmit={this.setNumberOfDives}/>
            <br/><br/>
            <DiveOverviewModal/>
            <br/><br/>
            {numberOfDivesFlag ?
                <React.Fragment>
                  {/* # of Columns: # of dives + # of surface interval columns */}
                  {numberOfDives > divesPerRow ?
                      <React.Fragment>
                        {renderDiveGrids()}
                      </React.Fragment>
                      :
                      <Grid columns={numberOfDives + (numberOfDives - 1)}>
                        {renderDiveColumns(0, numberOfDives)}
                      </Grid>}
                </React.Fragment> : ''
            }
          </Container>
        </div>
    );
  }
}

export default App;
