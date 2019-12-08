import { defaultNDLs, depths, table1, table2, table3 } from './PadiTables';

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

// If the input depth is not one of the table times, choose the next greatest time from the table in a given depth
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

// Return the pressure group given the depth and time
export const getPressureGroup = (depth, time) => {
  const nearestDepth = getNearestDepth(depth);
  const nearestTime = getNearestTime(depth, time);
  return table1[nearestDepth][nearestTime];
};

// Parse the time strings of table2 (Surface Interval Table) from 'HH:MM' format into a minutes int value.
export const parseTimeString = (string) => {
  const split = string.split(':');
  const hours = parseInt(split[0], 10);
  const hoursToMinutes = hours * 60;
  const remainingMinutes = parseInt(split[1], 10);
  return hoursToMinutes + remainingMinutes;
};

// Given the pressure group calculated from Table 1, get the pressure group for Table 2 based on the interval input
export const getPressureGroupForTableTwo = (startPressureGroup, intervalInput) => {
  if (intervalInput >= 180) { // greater than 3 hours
    return 'A';
  }
  const surfaceIntervals = table2[startPressureGroup];
  const nextPossiblePressureGroups = Object.keys(surfaceIntervals);
  for (let pressureGroup of nextPossiblePressureGroups) {
    const interval = surfaceIntervals[pressureGroup];
    if (interval[0] === "" || interval[1] === "") continue; // Ignore the empty interval arrays
    const firstIntervalToMinutes = parseTimeString(interval[0]);
    const secondIntervalToMinutes = parseTimeString((interval[1]));
    if (firstIntervalToMinutes <= intervalInput && intervalInput <= secondIntervalToMinutes) {
      return pressureGroup;
    }
  }
};

// ## Calculating Minimum Surface Interval ## //
export const getStartPressureGroupForMinimumSurfaceInterval = (depth, time) => {
  const nearestDepth = getNearestDepth(depth);
  const maximumTimes = table3[nearestDepth];
  const pressureGroupKeys = Object.keys(maximumTimes);
  for (let pressureGroup of pressureGroupKeys) {
    const andl = maximumTimes[pressureGroup][1];
    if (time > andl) {
      // continue
    } else {
      return pressureGroup;
    }
  }
};

export const getSurfaceInterval = (initialPressureGroup, finalPressureGroup) => table2[initialPressureGroup][finalPressureGroup];

export const getMinimumSurfaceInterval = (prevPressureGroup, depth, time) => {
  const startPressureGroup = getStartPressureGroupForMinimumSurfaceInterval(depth, time);
  if (prevPressureGroup < startPressureGroup) {
    return 0;
  }
  const surfaceInterval = getSurfaceInterval(prevPressureGroup, startPressureGroup);
  return parseTimeString(surfaceInterval[0]);
};

// ########################################## //

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
