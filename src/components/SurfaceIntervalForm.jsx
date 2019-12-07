import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

class SurfaceIntervalForm extends React.Component {
  render() {
    const { index, dives, handleIntervalChange, handleSubmit } = this.props;

    return (
        <React.Fragment>
          <Form onSubmit={(event, data) => handleSubmit(event, index)}>
            <Form.Input
                placeholder={`Surface Interval (minutes)`}
                required={true}
                onChange={(event, value) => handleIntervalChange(event, value, index)}
            />
            <Form.Button content={`Set Surface Interval`}/>
          </Form>
        </React.Fragment>
    );
  }
}

SurfaceIntervalForm.propTypes = {
  index: PropTypes.number.isRequired,
  dives: PropTypes.array.isRequired,
  handleIntervalChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SurfaceIntervalForm;
