import React from 'react';
import PropTypes from 'prop-types';

class SurfaceIntervalForm extends React.Component {
  render() {
    const { index } = this.props;

    return (
      <React.Fragment>
        <label htmlFor={`intervalInput${index}`}>Surface Interval (minutes) </label>
        <input type="number" id={`intervalInput${index}`} name={`intervalInput${index}`}/>
      </React.Fragment>
    );
  }
}

SurfaceIntervalForm.propTypes = {
  index: PropTypes.number.isRequired,
};

export default SurfaceIntervalForm;
