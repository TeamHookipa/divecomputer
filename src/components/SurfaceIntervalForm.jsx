import React from 'react';
import PropTypes from 'prop-types';
import { getPressureGroup } from '../api/Utilities';

class SurfaceIntervalForm extends React.Component {
  render() {
    const { index, dives, flag } = this.props;
    let pg = '';
    if (flag) {
      const diveObject = dives[index];
      const depth = diveObject.DEPTH;
      const time = diveObject.TIME;
      pg = getPressureGroup(depth, time);
    }
    return (
      <React.Fragment>
        <label htmlFor={`intervalInput${index}`}>Surface Interval (minutes) </label>
        <input type="number" id={`intervalInput${index}`} name={`intervalInput${index}`}/>
        {flag ?
          <div>Current Pressure Group: {pg}</div>: ''}
      </React.Fragment>
    );
  }
}

SurfaceIntervalForm.propTypes = {
  index: PropTypes.number.isRequired,
  dives: PropTypes.array.isRequired,
  flag: PropTypes.bool.isRequired,
};

export default SurfaceIntervalForm;
