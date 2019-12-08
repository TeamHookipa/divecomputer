import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

class NumberOfDivesInputForm extends React.Component {
  render() {
    const { handleNumberOfDiveChange, handleSubmit } = this.props;
    return (
        <div id="numberOfDivesInputForm">
          <Form onSubmit={handleSubmit}>
            <Form.Input
                placeholder={'Number of Dives'}
                required={true}
                onChange={handleNumberOfDiveChange}
            />
            <Form.Button color={`black`} content={`Plan Out Your Dive!`}/>
          </Form>
        </div>
    )
  }
}

NumberOfDivesInputForm.propTypes = {
  handleNumberOfDiveChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default NumberOfDivesInputForm;
