import { depths, table1 } from './PadiTables';
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
  const timesStringArray = Object.keys(table1[nearestDepth]);
  let times = [];
  // dunno if I need to do this but I'm doing this just in case
  for (let t of timesStringArray) {
    times.push(parseInt(t, 10));
  }
  times = times.sort();
  let lastTimeChecked = 0;
  for (let t of times) {
    if (lastTimeChecked < time && time <= t) {
      return t;
    }
    lastTimeChecked = t;
  }
};

export const getPressureGroup = (depth, time) => {
  const nearestDepth = getNearestDepth(depth);
  const nearestTime = getNearestTime(depth, time);
  return table1[nearestDepth][nearestTime];
};

