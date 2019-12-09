
import React from 'react';
import { getNearestDepth, getNearestTime, getPressureGroup, parseTimeString, getPressureGroupForTableTwo, getStartPressureGroupForMinimumSurfaceInterval, getMinimumSurfaceInterval, isSafetyStopRequired } from './api/Utilities';

//Tests getNearestDepth Function
//Checks it returns correct result and checks it returns a int
it('Correctly returns nearest depth', () => {
  expect(getNearestDepth(11)).toBe(12);
});

//Tests for getNearestTime function
//Checks it returns what is expected and it returns a int
it('Correctly computes and returns nearest time', () => {
  expect(getNearestTime(12,40)).toBe(42);
});

//Tests for getPressureGroup
//Checks if returns the correct pressure group and a string of one character
it('Correctly computes and returns Pressure group', () => {
  expect(getPressureGroup(12,42)).toBe('I');
});

//Tests for parseTimeString
//Checks if returns correct value for converting a format of HH:MM to minutes
it('Correctly converts hours:minutes into minutes format', () => {
  expect(parseTimeString("10:05")).toBe(605);
});

//Tests for getPressureGroupForTableTwo
//Makes sure returns correct pressure group for table 2
it('Correctly returns the second pressure group', () => {
  expect(getPressureGroupForTableTwo('B',181)).toBe('A');
});
it('Correctly returns the second pressure group', () => {
  expect(getPressureGroupForTableTwo('B',50)).toBe('A');
});

//Tests for getStartPressureGroupForMinimumSurfaceInterval
//Checks to see if it calculates correct minimum surface Interval and returns correct group
it('Correctly calculates the pressure group for a given minimum surface interval', () => {
  expect(getStartPressureGroupForMinimumSurfaceInterval(20, 26)).toBe('F');
});

//Tests that getMinimumSurfaceInterval returns correct value
it('Correctly calculates minimum surface interval', () => {
  expect(getMinimumSurfaceInterval('B',20,26)).toBe(0);
});
it('Correctly calculates minimum surface interval', () => {
  expect(getMinimumSurfaceInterval('L',20,26)).toBe(35);
});

//Tests if isSafetyStopRequired returns correct value
it('Correctly calculates that a safety stop is required', () => {
  expect(isSafetyStopRequired(30, 100)).toBe(true);
});
it('Correctly calculates that a safety stop is not required', () => {
  expect(isSafetyStopRequired(10, 5)).toBe(false);
});


