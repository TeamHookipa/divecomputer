import * as React from 'react';
import './App.css';
import { getNearestDepth, getNearestTime } from './api/Utilities';
import DiveInputForm from './components/DiveInputForm';
import SurfaceIntervalForm from './components/SurfaceIntervalForm';
import { Container, Grid } from 'semantic-ui-react';
import { defaultNDLs } from './api/PadiTables';

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

  setDiveInputs = () => {
    const { numberOfDives } = this.state;
    this.setState({ flag: true });
    for (let i = 0; i < numberOfDives; i++) {
      const depthInput = parseInt(document.getElementById(`depthInput${i}`).value, 10);
      const timeInput = parseInt(document.getElementById(`timeInput${i}`).value, 10);
      const depth = getNearestDepth(depthInput);
      const time = getNearestTime(depthInput, timeInput);
      let ndl = 0;
      if (numberOfDives === 1) {
        console.log("test");
        ndl = defaultNDLs[depth];
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

    const confirmNumberOfDives = () => {
      const numberOfDivesInputValue = document.getElementById("numberOfDives").value;
      if (numberOfDivesInputValue < 1) {
        window.alert("Enter at least one dive.");
      } else
        if (numberOfDivesInputValue > 8) {
          window.alert("More than 8 dives is not supported.");
        } else {
          this.setState({ numberOfDives: parseInt(numberOfDivesInputValue, 10) });
        }
    };

    const renderDiveColumns = () => {
      let forms = [];
      const { numberOfDives, NDL, flag } = this.state;
      for (let i = 0; i < numberOfDives; i++) {
        forms.push(
          <React.Fragment key={i}>
            <Grid.Column>
              <DiveInputForm index={i}/>
              {flag ?
                <React.Fragment>
                  <div>NDL: {dives[i].NDL} minutes</div>
                  <div>Pressure Group: </div>
                </React.Fragment> : ''}
            </Grid.Column>
            <Grid.Column>
              {// Render Surface Interval Input Forms
                (numberOfDives > 1 && i !== (numberOfDives - 1)) ?
                  <SurfaceIntervalForm index={i} dives={dives} flag={flag}/>
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
          <button type="button" onClick={confirmNumberOfDives}>Plan Out Your Dive!</button>
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
