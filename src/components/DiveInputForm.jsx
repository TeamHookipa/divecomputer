import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

class DiveInputForm extends React.Component {
  render() {
    const { index, handleDepthChange, handleTimeChange, handleSubmit } = this.props;
    return (
        <React.Fragment>
          <Form onSubmit={(event) => handleSubmit(event, index)}>
            <Form.Input
                placeholder={'Depth (meters)'}
                required={true}
                onChange={(event, value) => handleDepthChange(event, value, index)}
            />
            <Form.Input
                placeholder={'Time (minutes)'}
                required={true}
                onChange={(event, value) => handleTimeChange(event, value, index)}
            />
            <Form.Button color={`black`} content={`Set Dive #${index}`}/>
          </Form>
        </React.Fragment>
    );
  }
}

DiveInputForm.propTypes = {
  index: PropTypes.number.isRequired,
  handleDepthChange: PropTypes.func.isRequired,
  handleTimeChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default DiveInputForm;
