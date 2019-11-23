//DISCLAIMER: SHOULD NOT BE USED FOR REAL DIVE


//TABLE 1 CALCULATIONS
//NOTE: Create objects for each depth, each with an array of possible times and an int for NDL

//NOTE: ask for input for depth, store to a variable, pass as a parameter
//Deciding dive depth
  //Variables: depth  Parameter: depth
  //if depth is greater than 40, set depth to 40
  //Let user know depth greater than 40 is not recommended, so it was set to 40
  //if depth is less than or equal to 10, set depth to 10
  //else, set depth to value closest
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
table_one = {10: {'122': 'T', '178': 'X', '219': 'Z', '133': 'U', '88': 'P', '64': 'L', '112': 'S', '82': 'O',
    '199': 'Y', '26': 'C', '20': 'B', '160': 'W', '45': 'H', '41': 'G', '145': 'V', '75': 'N',
    '70': 'M', '95': 'Q', '104': 'R', '10': 'A', '59': 'K', '54': 'J', '30': 'D', '37': 'F',
    '50': 'I', '34': 'E'},
  12: {'88': 'S', '116': 'W', '53': 'L', '66': 'O', '134': 'Y', '82': 'R', '26': 'D', '23': 'C',
    '45': 'J', '42': 'I', '29': 'E', '9': 'A', '147': 'Z', '76': 'Q', '108': 'V', '125': 'X',
    '71': 'P', '101': 'U', '94': 'T', '38': 'H', '17': 'B', '32': 'F', '57': 'M', '49': 'K',
    '62': 'N', '35': 'G'},
  20: {'10': 'B', '13': 'C', '30': 'M', '15': 'D', '21': 'H', '16': 'E', '18': 'F', '44': 'T',
    '23': 'I', '28': 'L', '26': 'K', '40': 'R', '34': 'O', '45': 'U', '36': 'P', '25': 'J',
    '6': 'A', '20': 'G', '38': 'Q', '32': 'N', '42': 'S'},
  14: {'43': 'L', '61': 'Q', '64': 'R', '53': 'O', '82': 'V', '87': 'W', '24': 'E', '27': 'F',
    '22': 'D', '47': 'M', '29': 'G', '40': 'K', '8': 'A', '68': 'S', '77': 'U', '98': 'Y',
    '73': 'T', '92': 'X', '15': 'B', '19': 'C', '32': 'H', '57': 'P', '37': 'J', '50': 'N',
    '35': 'I'},
  22: {'24': 'K', '25': 'L', '13': 'D', '12': 'C', '15': 'E', '21': 'I', '22': 'J', '16': 'F',
    '19': 'H', '18': 'G', '30': 'O', '37': 'S', '29': 'N', '34': 'Q', '27': 'M', '5': 'A',
    '36': 'R', '32': 'P', '9': 'B'},
  16: {'60': 'T', '63': 'U', '67': 'V', '25': 'G', '27': 'H', '21': 'E', '48': 'P', '23': 'F',
    '45': 'O', '42': 'N', '29': 'I', '7': 'A', '39': 'M', '72': 'X', '70': 'W', '13': 'B',
    '17': 'C', '19': 'D', '32': 'J', '56': 'S', '37': 'L', '50': 'Q', '53': 'R', '34': 'K'},
  18: {'56': 'W', '24': 'H', '26': 'I', '20': 'F', '22': 'G', '46': 'R', '28': 'J', '43': 'Q',
    '41': 'P', '6': 'A', '11': 'B', '39': 'O', '15': 'C', '48': 'S', '16': 'D', '55': 'V',
    '18': 'E', '30': 'K', '51': 'T', '36': 'N', '53': 'U', '34': 'M', '32': 'L'},
  30: {'11': 'F', '10': 'E', '13': 'H', '12': 'G', '15': 'J', '14': 'I', '17': 'L', '16': 'K',
    '19': 'M', '20': 'N', '3': 'A', '6': 'B', '9': 'D', '8': 'C'},
  42: {'8': 'F', '4': 'B', '7': 'E', '6': 'D'},
  35: {'11': 'H', '10': 'G', '13': 'J', '12': 'I', '14': 'K', '3': 'A', '5': 'B', '7': 'C',
    '9': 'F', '8': 'D'},
  25: {'11': 'D', '10': 'C', '13': 'E', '15': 'G', '14': 'F', '17': 'H', '23': 'M', '19': 'J',
    '18': 'I', '22': 'L', '28': 'P', '26': 'O', '29': 'Q', '4': 'A', '8': 'B', '25': 'N',
    '21': 'K'},
  40: {'9': 'G', '8': 'F', '5': 'B', '7': 'E', '6': 'C'}}