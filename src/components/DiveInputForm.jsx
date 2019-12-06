import React from 'react';
import PropTypes from 'prop-types';

class DiveInputForm extends React.Component {
  render() {
    const { index } = this.props;
    return (
      <React.Fragment>
        <span>Dive #{index} </span>
        <br/>
        <label htmlFor={`depthInput${index}`}>Depth (meters) </label>
        <br/>
        <input type="number" id={`depthInput${index}`} name={`depthInput${index}`}/>
        <br/>
        <label htmlFor={`timeInput${index}`}>Time (minutes) </label>
        <br/>
        <input type="number" id={`timeInput${index}`} name={`timeInput${index}`}/>
      </React.Fragment>
    );
  }
}

DiveInputForm.propTypes = {
  index: PropTypes.number.isRequired,
};

export default DiveInputForm;
