import React from 'react';
import PropTypes from 'prop-types';
import { List, Message } from 'semantic-ui-react';
import { getPressureGroup } from '../api/Utilities';
import { defaultNDLs } from '../api/PadiTables';

class SafetyStopIndicator extends React.Component {
  render() {
    const { index, depth, time, isNegative } = this.props;
    return (
        <React.Fragment>
          {isNegative ?
              <Message negative={true}>
                <Message.Header>SAFETY STOP REQUIRED AFTER DIVE #{index}</Message.Header>
                Safety stops are REQUIRED for dive depths of 30 meters or deeper OR if the pressure group
                for the dive is within three pressure groups of its no decompression limit.
                <List bulleted={true}>
                  <List.Header>Dive #{index} Statistics</List.Header>
                  <List.Item>Depth: {depth} meters</List.Item>
                  <List.Item>
                    Pressure Group Achieved: {getPressureGroup(depth, time)}
                  </List.Item>
                  <List.Item>
                    Pressure Group of NDL: {getPressureGroup(depth, defaultNDLs[depth])}
                  </List.Item>
                </List>
              </Message>
              :
              <Message warning={true}>
                <Message.Header>Safety Stop Recommended after Dive #{index}</Message.Header>
                A safety stop is recommended 5 meters below surface for 3 to 5 minutes before surfacing at
                the end of all dives.
              </Message>}
        </React.Fragment>
    );
  }
}

SafetyStopIndicator.propTypes = {
  index: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  isNegative: PropTypes.bool.isRequired,
};

export default SafetyStopIndicator;
