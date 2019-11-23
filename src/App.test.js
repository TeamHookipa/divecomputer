
import React from 'react';
import ReactDom from 'react-dom';
import App from './App.';
import { getNearestDepth, getNearestTime, getPressureGroup } from './api/PadiTableHelperFunctions';
import { depths, table1 } from './PadiTables';


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



