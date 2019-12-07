import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

class DiveInputForm extends React.Component {
  render() {
    const { index, dives handleDepthChange, handleSubmit } = this.props;
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

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Input
                  placeholder={'Depth (meters)'}
                  onChange={(event, value) => handleDepthChange(event, value, index)}
              />
              <Form.Button content={'Submit Dive'}/>
            </Form.Group>
          </Form>
        </React.Fragment>
    );
  }
}

DiveInputForm.propTypes = {
  index: PropTypes.number.isRequired,
  dives: PropTypes.array.isRequired,
  handleDepthChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default DiveInputForm;
