//TABLE 1 CALCULATIONS
//NOTE: Create objects for each depth, each with an array of possible times and an int for NDL

//NOTE: ask for input for depth, store to a variable, pass as a parameter
//Deciding dive depth
  //Variables: depth, maxTime; Parameter: depth
  //if depth is greater than 40, set depth to 40
  //Let user know depth greater than 40 is not recommended, so it was set to 40
  //if depth is less than or equal to 10, set depth to 10
  //if depth%2 = 1, add 1 to depth
  //return depth

//NOTE: store depth to a variable
//NOTE: ask for input for time and store into a variable

//deciding NDL
  //Variables: time, ndl, retVal, diff, done(a boolean)
  // Parameter: depth (received fr previous method) and time
  //match object to depth
  //search object's "time array" with while(done == false)
  //iterate through time array using while loop
    //if (time - array[i]) < 0
      //done = true
      //else if (time - array[i] == 0)
        //set retVal to array[i]
      //else if (diff > time - array[i])
        //set retVal to array[i]
        //set diff to time - array[i]

//SETTING PRESSURE GROUP