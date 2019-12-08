import React from 'react';
import PropTypes from 'prop-types';
import { List, Message } from 'semantic-ui-react';
import { getPressureGroup } from '../api/Utilities';
import { defaultNDLs } from '../api/PadiTables';

class SafetyStopIndicator extends React.Component {
  render() {
    const { index, depth, time, isNegative } = this.props;

    // Since arrays start at 0, first element is called "0" if we access it directly. This function increments that. ONLY for
    // UI purposes, this should not be used for any functionality as it will mess up the logic very badly.
    const incrementIndex = (index) => index + 1;

    return (
        <React.Fragment>
          {isNegative ?
              <Message negative={true}>
                <Message.Header>SAFETY STOP REQUIRED AFTER DIVE #{incrementIndex(index)}</Message.Header>
                Safety stops are REQUIRED for dive depths of 30 meters or deeper OR if the pressure group
                for the dive is within three pressure groups of its no decompression limit.
                <List bulleted={true}>
                  <List.Header>Dive #{incrementIndex(index)} Statistics</List.Header>
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
                <Message.Header>Safety Stop Recommended after Dive #{incrementIndex(index)}</Message.Header>
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
