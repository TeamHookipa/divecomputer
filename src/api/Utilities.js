import { defaultNDLs, depths, table1, table2 } from './PadiTables';
// If the input depth is not one of the table depths, choose the next greatest depth from the table
export const getNearestDepth = (depth) => {
  let lastDepthChecked = 0;
  for (let d of depths) {
    if (lastDepthChecked < depth && depth <= d) {
      return d;
    }
    lastDepthChecked = d;
  }
};

export const getNearestTime = (depth, time) => {
  const nearestDepth = getNearestDepth(depth);
  const times = Object.keys(table1[nearestDepth]);
  let lastTimeChecked = 0;
  for (let t of times) {
    if (lastTimeChecked < time && time <= t) {
      return parseInt(t, 10);
    }
    lastTimeChecked = t;
  }
  return time;
};

export const getPressureGroup = (depth, time) => {
  const nearestDepth = getNearestDepth(depth);
  const nearestTime = getNearestTime(depth, time);
  return table1[nearestDepth][nearestTime];
};

export const parseTimeString = (string) => {
  const split = string.split(':');
  const hours = parseInt(split[0], 10);
  const hoursToMinutes = hours * 60;
  const remainingMinutes = parseInt(split[1], 10);
  return hoursToMinutes + remainingMinutes;
};

export const getPressureGroupForTableTwo = (startPressureGroup, intervalInput) => {
  if (intervalInput >= 180) { // greater than 3 hours
    return 'A';
  }
  const surfaceIntervals = table2[startPressureGroup];
  const nextPossiblePressureGroups = Object.keys(surfaceIntervals);
  for (let pressureGroup of nextPossiblePressureGroups) {
    const interval = surfaceIntervals[pressureGroup];
    if (interval[0] === "" || interval[1] === "") continue;
    const firstIntervalToMinutes = parseTimeString(interval[0]);
    const secondIntervalToMinutes = parseTimeString((interval[1]));
    if (firstIntervalToMinutes <= intervalInput && intervalInput <= secondIntervalToMinutes) {
      return pressureGroup;
    }
  }
};

export const isSafetyStopRequired = (depth, time) => {
  const pressureGroup = getPressureGroup(depth, time);
  const maxPressureGroup = getPressureGroup(depth, defaultNDLs[depth]);
  const asciiPG = pressureGroup.charCodeAt(0);
  const asciiMPG = maxPressureGroup.charCodeAt(0);
  const lowerBound = asciiMPG - 3;
  return lowerBound <= asciiPG && asciiPG <= asciiMPG;

};

// TODO: Minimum Surface Interval
// TODO: Required Safety Stop
