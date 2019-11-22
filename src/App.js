import * as React from 'react';
import './App.css';
import { getNearestDepth, getNearestTime } from './api/PadiTableHelperFunctions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDives: 0,
      dives: [],
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
          <label htmlFor={"depthInput"}>Depth (meters) </label>
          <input type="number" id={"depthInput"} name={"depthInput"}/>

          <label htmlFor={"timeInput"}>Time (minutes) </label>
          <input type="number" id={"timeInput"} name={"timeInput"}/>
        </div>
      }
      for (let i = 0; i < this.state.numberOfDives; i++) {
        forms.push(<div key={i}>
          <span>Dive #{i} </span>
          <label htmlFor={`depthInput${i}`}>Depth (meters) </label>
          <input type="number" id={`depthInput${i}`} name={`depthInput${i}`}/>

          <label htmlFor={`timeInput${i}`}>Time (minutes) </label>
          <input type="number" id={`timeInput${i}`} name={`timeInput${i}`}/>
        </div>);
      }
      return forms;
    };

    return (
      <div className="App">
        <h1><b>DISCLAIMER: THIS CODE IS FOR PROTOTYPING PURPOSES ONLY, DO NOT USE TO PLAN FOR A REAL DIVE</b></h1>

        <label htmlFor="numberOfDives"># of Dives</label>
        <input type="number" id="numberOfDives" name="numberOfDives"/>
        <button type="button" onClick={confirmNumberOfDives}>Plan Out Your Dive!</button>
        {
          numberOfDives > 0 &&
          <React.Fragment>
            {renderDiveInputForms()}
            <button type="button" onClick={planDive}>Plan Dive</button>
          </React.Fragment>
        }
      </div>
    );
  }
}

export default App;
