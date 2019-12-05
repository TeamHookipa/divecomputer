import * as React from 'react';
import './App.css';
import { getNearestDepth, getNearestTime } from './api/PadiTableHelperFunctions';
import { defaultNDLs } from './api/PadiTables';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDives: 0,
      dives: [],
      NDL: 0,
    }
  }

  setFormInputs = () => {
    for (let i = 0; i < this.state.numberOfDives; i++) {
      const depthInput = parseInt(document.getElementById(`depthInput${i}`).value, 10);
      const timeInput = parseInt(document.getElementById(`timeInput${i}`).value, 10);
      const depth = getNearestDepth(depthInput);
      const time = getNearestTime(depthInput, timeInput);
      const diveInfo = {
        'DEPTH': depth,
        'TIME': time,
      };
      this.setState(prevState => ({ dives: [...prevState.dives, diveInfo] }));
      this.NDL = defaultNDLs[depth];
    }
  };

  render() {
    const { numberOfDives, dives } = this.state;

    const planDive = () => {
      this.setFormInputs();

    };

    const confirmNumberOfDives = () => {
      const numberOfDivesInputValue = document.getElementById("numberOfDives").value;
      if (numberOfDivesInputValue < 1) {
        window.alert("Number of dives is invalid.");
      } else {
        this.setState({ numberOfDives: parseInt(numberOfDivesInputValue, 10) });
      }
    };

    const renderDiveInputForms = () => {
      let forms = [];
      const { numberOfDives } = this.state;
      if (numberOfDives === 1) {
        return <div>
          <label htmlFor={`depthInput${0}`}>Depth (meters) </label>
          <input type="number" id={`depthInput${0}`} name={`depthInput${0}`}/>

          <label htmlFor={`timeInput${0}`}>Time (minutes) </label>
          <input type="number" id={`timeInput${0}`} name={`timeInput${0}`}/>
        </div>
      }
      // for (let i = 0; i < this.state.numberOfDives; i++) {
      //   forms.push(<div key={i}>
      //     <span>Dive #{i} </span>
      //     <label htmlFor={`depthInput${i}`}>Depth (meters) </label>
      //     <input type="number" id={`depthInput${i}`} name={`depthInput${i}`}/>
      //
      //     <label htmlFor={`timeInput${i}`}>Time (minutes) </label>
      //     <input type="number" id={`timeInput${i}`} name={`timeInput${i}`}/>
      //   </div>);
      // }
      return forms;
    };

    return (
      <div className="App">
        <h1><b>DISCLAIMER: THIS CODE IS FOR PROTOTYPING PURPOSES ONLY, DO NOT USE TO PLAN FOR A REAL DIVE</b></h1>


        <label htmlFor="numberOfDives"># of Dives</label>
        <input type="number" id="numberOfDives" name="numberOfDives" max="1" min="1"/>
        <button type="button" onClick={confirmNumberOfDives}>Plan Out Your Dive!</button>
        {
          numberOfDives > 0 &&
          <React.Fragment>
            {renderDiveInputForms()}
            <button type="button" onClick={planDive}>Plan Dive</button>
          </React.Fragment>
        }
        <div>
          No-Decompression Limit (minutes): {this.NDL}
        </div>
      </div>
    );
  }
}

export default App;
