// Output section
/*
- previousOutputEl: Html paragraph element that represents the previous calculation
- currentOutputEl: Html paragraph element that represents the current equation that the user is manipulating.
*/
const previousOutputEl = document.getElementById('previous-output');
const currentOutputEl = document.getElementById('current-output'); 

// Calculator buttons
/*
- clearBtn: html button element that will clear the current output or equation if clicked, and if clicked when the current output is empty, it
will clear all data from the calculator.
- deleteBtn: Deletes current digit or symbol in the output
- digitBtns: nodelist that represents buttons linked to digits 0 to 9, and the decimal button. When clicked it will add these digits to the equation
and add those digits onto variables representing numbers.
- arithmeticBtns: Nodelist representing mathematical operation buttons such as add, subtract, multiply, divide, and modulo. However, it will calculate
the answer between two numbers if the user tries have more than 2 numbers on screen.
- equalBtn: The equal or equate button that will calculate the answer between two numbers.
*/
const clearBtn = document.getElementById('clear-btn');
const deleteBtn = document.getElementById('delete-btn');
const digitBtns = document.querySelectorAll('.digit-btn');
const arithmeticBtns = document.querySelectorAll('.arithmetic-btn');
const equalBtn = document.getElementById('equal-btn');

// Calculator history section
/*
- directionalBtnsContainer: Div element that contains up and down button for traversing the calculation history of the calculator.
- directionalBtns: Nodelist with the up and down buttons. The up button will show the previous calculations in the calculator's history, whilst
the down button will show more recent calculations.
*/
const directionalBtnsContainer = document.querySelector('.directional-btns-container');
const directionalBtns = document.querySelectorAll('.directional-btn');

/* 
- decimal_btn_enabled: Boolean that controls whether the decimal button is available to be used.
- error-detected: Boolean that records if an error happens such as a division error, equation error, etc.
- used_equals_btn: Boolean that checks if the user has used the equals button in order to do a calculation. Useful because we don't want the user
directly adding digits onto a result, so by having this boolean, we can know when they've used the equals button and act accordingly.
- equationHistory: Array that will contain equationEntry objects.
- equationIndex: Represents the positions of the equationHistory array, allowing the user to access different calculations in the calculator's history
- equationEntry: Object that contains the two numbers, operation, and mathematical result of a calculation.
- num1: Variable representing the first number hte user does calculations with. Also acts as a total where the result of a + b, is assigned by to a and b is emptied so that a new number can act as b.
- num2: Variable representing the second number that the user does calculations with.
- operator: Strings such as 'add', 'subtract', 'multiply', 'divide', and 'mod' that represent the arithmetic operation that is used on two numbers.
- equation: Variable that contains digits and symbols to show the equation being done on screen; note this variable only handles the visuals and no actual mathematical operations occur with this variable.
- mathSymbols: Object containing mathematical symbols that will be added to the equation variable so that the user's input can be accurately rendered on screen.
*/
let decimal_btn_enabled = true;
let error_detected = false;
let used_equals_btn = false;
let equationHistory = [];
let equationIndex;
class equationEntry {
  constructor(firstNum, secondNum, operation, result) {
    this.firstNum = firstNum.toString();
    this.secondNum = secondNum.toString();
    this.operation = operation;
    this.result = result;
  }
}
let num1 = "";
let num2 = "";
let operator = "";
let equation = "";
const mathSymbols = {
  'mod': '%',
  'divide': '/',
  'multiply': 'x',
  'subtract': '-',
  'add': '+'
};

/*
+ Function will render the previous calculation on the calculator. Accepts 4 string parameters from a equationEntry object.
- That object represents numbers from a previous calcluation, and this function will render the values from that previous calculation
- The parameter firstNum has a default value of "FULL_CLEAR", so that when this function is called without arguments, it means the user wants to clear the calculator.
- As a result, when this happens, the previous output or previous calculation will be cleared.
*/
function renderPreviousOutput(firstNum = "FULL_CLEAR", secondNum, operation, result) {
  if (firstNum == 'FULL_CLEAR') {
    previousOutputEl.textContent = "";
  } else {
    previousOutputEl.textContent = `${firstNum} ${mathSymbols[operation]} ${secondNum} = ${result}`;
  }
}

/*
+ Function will render the current equation that the user is inputting; parameter 'output' represents equation
- Checks the error_detected boolean, so if error detected is false, then it renders the equations like usual, but if an error was detected as indicated by the boolean, then nothing will be rendered by this function.
- Displaying the error will be handled by the displayError function itself. 
NOTE: The reason why this error_detected boolean is needed and how we can't just use renderCurrentOutput(ErrorType) because the equal and arithmetic buttons will call the renderCurrentOutput function after the 
error handling function. The boolean stops those extra renders and lets the error handling function display the error without being overwritten.
*/
function renderCurrentOutput(output) {
  if (!error_detected) {
    output = output.toString(); //Ensure that the output or data being rendered is actually a string so we can do tests with it
    currentOutputEl.textContent = output;
  }
}

/*
+ Function that will handle some errors that the user creates
- Function will display in the output the type of error that happened, depending on where the error occurred in the program.
- Disables all buttons except for the clear button when an error occurs in order to show the user that they have to press the clear button to use the program again.
- Adds a css class onto those buttons in order to indicate that the button is disabled.
*/
function displayError(errorType) {
  currentOutputEl.textContent = errorType;
  error_detected = true; //set this to true so that the main rendering function doesn't render something that overwrites the 
  disableDigitBtns(true); //Disable all buttons except for the clear button, but also when clear button is pressed we re-enable all buttons again
  disableArithmeticBtns(true);  
  equalBtn.classList.add('button-disabled');
  deleteBtn.classList.add('button-disabled');
  equalBtn.disabled = true;
  deleteBtn.disabled = true;
}

/*
+ Function handles the calculation of two numbers, passed in as strings, and an operator
- Converts the arguments into floating point numbers and handles the math accordingly. 
- After it rounds it out if the result is it isn't an integer.
- Finally it returns the result as a string
*/
function calculate(firstNum, secondNum, operation) {
  firstNum = parseFloat(firstNum);
  secondNum = parseFloat(secondNum);
  let result;
  if (operation == "add") {
    result = firstNum + secondNum;
  } else if (operation == "subtract") {
    result = firstNum - secondNum;
  } else if (operation == "multiply") {
    result = firstNum * secondNum;
  } else { //all left is division and modulo; if we are dividing by zero then show an error and return nothing, else do the regular math
    if (secondNum === 0) {
      displayError('DivisionError');
    } else {
      switch(operation) {
        case "divide":
          result = firstNum / secondNum;
          break;
        case 'mod':
          result = firstNum % secondNum;
          break;
      }
    }
  }
  // If the result is a decimal or floating point then we want to round it
  if (!Number.isInteger(result)) { 
    result = Number(result).toFixed(3); 
  }
  /*
  - Have the result changed to a string because it will be assigned to num1, and the num1/num2 variables need to be strings so that the program can correctly identify them
  - Create an 'equationEntry' object, which has data about the calculation, and store it in the equationHistory array for later.
  - When you do a calculation update the index position so that when user does a calculation it takes them back to the latest calculations in the history.
  - Then render the previous output and return 'result', which will be assigned to the num1 value of the new calculation. 
  */
  result = result.toString(); 
  const entry = new equationEntry(firstNum, secondNum, operation, result);
  equationHistory.push(entry);
  if (equationHistory.length > 1) {
    directionalBtnsContainer.classList.remove('content-hidden');
  }
  equationIndex = equationHistory.length - 1;
  renderPreviousOutput(firstNum, secondNum, operation, result);
  return result;
};

/*
+ Function controls whether the decimal button will be accessible depending on whether the current number passed in has a decimal or not. These numbers being the string variables num1 and num2.
- If the current number already has a decimal point then the decimal button can't be pressed again and vice versa. Function disableDigitBtns is called with boolean and 'decimal' to indicate whether we are disabling
or enabling a button, and 'decimal' indicates that just the decimal button is being disabled or enabled in this case.
*/
function decimalCheck(num) {
  if (num.includes('.')) {
    disableDigitBtns(true, 'decimal');
  } else {
    disableDigitBtns(false, 'decimal');
  }
}

/*
+ Function that disables or enables the digitBtns.
- The boolean 'true' indicates that the digit buttons will be disabled, and false means that they will be enabled.
- The parameter range has the default value 'all' to indicate that all buttons are being enabled or disabled. The decimalCheck function will have the range argument = 'decimal', which indicates that only the 
decimal button will be enabled or disabled
*/
function disableDigitBtns(bool, range="all") {
  if (range == "all") {
    digitBtns.forEach(btn => {
      btn.disabled = bool;
      if (bool) {
        btn.classList.add('button-disabled');
      } else {
        btn.classList.remove('button-disabled');
      }
    });
  } else {
    digitBtns.forEach(btn => {
      if (btn.dataset.value == '.') {
        btn.disabled = bool;
        if (bool) {
          btn.classList.add('button-disabled');
        } else {
          btn.classList.remove('button-disabled');
        }
      }
    })
  }
}

/*
+ Function enables or disables the arithmetic buttons based on a boolean argument.
- if we want to disable the button then we tag on the disabled button class, and indicate its disabled
- if its false then we are enabling the button, so we have to indicate the button enabled.
*/
function disableArithmeticBtns(bool) {
  arithmeticBtns.forEach(btn => {
    btn.disabled = bool
    if (bool) { 
      btn.classList.add('button-disabled');
    } else {   
      btn.classList.remove('button-disabled');
    }
  });
}

/*
+ Function clears the data. Clears both numbers, operator, and the equation
- Clears current numbers, operators, equation, booleans, and renables any disabled button.
- If the equation variable is already blank, then that means after clearing the current line on the calculator, the user wants to fully clear the calculator, which clears the history of the calculator.
- If an error was triggered this function would be executed to clear the data the calculator, which allows buttons to be clicked again after being disabled.
*/
function clearData() {
  num1 = "";
  num2 = "";
  operator = "";
  // If the equation empty then they want a full clear 
  if (equation == "") { 
    equationHistory = [];
    equationIndex = 0;
    renderPreviousOutput(); 
    directionalBtnsContainer.classList.add('content-hidden');
  }
  equation = "";
  used_equals_btn = false;
  error_detected = false; 
  renderCurrentOutput("");
  disableDigitBtns(false);
  disableArithmeticBtns(false); 
  equalBtn.classList.remove('button-disabled');
  deleteBtn.classList.remove('button-disabled');
  equalBtn.disabled = false;
  deleteBtn.disabled = false;
}

/*
+ For the up and down buttons, add a click event listener that allows the user to traverse up and down through the history of the calculator.
- Get the id of the button to know whether we are accessing a previous or newer calculation. The calculations are in an array, and the most recent calculations are the last elements in the array.
- Traverse through the array by incrementing or decrementing the index value, and if the user goes beyond index 0, transfer to the last index value. Or if they go beyond the upper bound, then put them at index 0.
*/
directionalBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btnID = e.currentTarget.dataset.id;
    if (btnID == 'up') {
      equationIndex -= 1;
      if (equationIndex < 0) {
        equationIndex = equationHistory.length - 1;
      }
    } else {
      equationIndex += 1;
      if (equationIndex > equationHistory.length - 1) {
        equationIndex = 0;
      }
    }
    /*
    - Then get the object in equationHistory at that index, values of that object.
    - let the math result be num1 and empty num2. Then set equation to result so that user's equation is up to date; this is in case the user wants to use a mathematical result from a previous entry
    - Call functions to render the digits and math
    - Set the used_equals_btn boolean to true because we don't want the user to directly manipulate the result of a previous entry by addding on digits or whatnot, makes them use an arithmetic operator first.
    */
    const {firstNum, secondNum, operation, result} = equationHistory[equationIndex];
    num1 = result; //let num1 be the answer
    num2 = "";
    equation = result;
    renderPreviousOutput(firstNum, secondNum, operation, result);
    renderCurrentOutput(result);  
    used_equals_btn = true; 
  })
})

/*
+ Eventlistenerwith the equal btn handles calculations made with the equal button
- Checks if the first and second number (which are strings) have a length greater than 1. If this is true then the user entered numbers instead of leaving the numbers blank.
- Also checks if the operator variable has a value, which means if the user has entered an operator alongside those two numbers.
1. Calculate the result and have num1 equal to the result. Clear num2 and the operator. Have the equation that's going to be displayed as num1 because that's the mathematical result
that's going to be displayed. Call a function to render the equation.
2. If the first conditional isn't met, then there's an error with the equation.

Now we don't want to adjust the result with the digit btns, so after the equal button is pressed we want to disable the digit btns until they use an arithmetic, I think a boolean would do well here

*/
equalBtn.addEventListener('click', function() {
  if ((num1.length > 0 && num2.length > 0) && (operator)) {
    num1 = calculate(num1, num2, operator);
    num2 = "";
    operator = "";
    equation = num1;
    renderCurrentOutput(equation);
    decimalCheck(num1) //because the first number is the only one on screen or the main focus
    // Check the decimal right here because it's a hole
    used_equals_btn = true;
    disableDigitBtns(true);
  } else {
    displayError("Equation Error");
  }
})

/*
+ Each arithmetic button is linked to an event listener.
- Function gets the id of the button, which will handle when we set a mathematical operation that will happen on the two numbers.
*/
arithmeticBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btnID = e.currentTarget.dataset.id;
    /* 
    - If they used the equal btn then the digit btns would have gotten disabled. The user would be lead to click the arithmetic buttons
    - If they click the arithmetic buttons, check if they used the equals btn. If they do then turn that boolean to false and call the function to disable the digit buttons.
    */
    if (used_equals_btn) {
      used_equals_btn = false;
      disableDigitBtns(false);
    }
    /*
    - First clause makes sure we can enter a negative number for num1, we press an arithmetic button first so num1 would be an empty string. If the operator is subtract we know they are trying to type in a negative number
    so we will allow it. Else if it was any other operator then we would throw an error since num1 is missing and they are trying to do an operation other than subtract (negate in this case)
    - Second clause: Makes it possible to enter a negative number for num2 because once the operator is set, we know the user is working on the second number because num1 is finished since the operator is already set
    so the number for the operator is set. And yes if the operator is false or isn't set then we are working on teh first number
    */
    if ((num1 === "") || (num2 === "" && operator)) {  
      if (btnID == 'subtract') {        
        if (operator) {
          num2 = '-' + num2;
          equation += '-';
        } else {  
          num1 = '-' + num1;
          equation += '-';
        }
      } else {
        displayError("Missing Number Error");
      }
    } else if (!operator) { 
      /*
      - [number] [operator] situation; If there is no operator then they are just setting a new operator
      - set the operator as the id, and add the operator onto the equation to be displayed
      */
      operator = btnID; 
      equation += mathSymbols[operator];
    } else if (operator && num2.length > 0) {
      /*
      - If there's an operator, and num2 has length, then we know that num2 is an actual number
      - Operator is already set  [number] [operator] [number] [new operator] situation
      - Assign num1 to the result, empty num2 because it's been calculated, assign operator to the ID of the btn, and update the equation variable. 
      NOTE: This handles all calculations made when the user doesn't use the equals button, but rather when the user has both num1 and num2 set to a value, and then they press an arithmetic button, then it makes 
      a calculation and sets the result of that calculation to num1, to make space for another number to be entered by the user by emptying num2.
      */
      num1 = calculate(num1, num2, operator);
      num2 = "";      
      operator = btnID; //set the new [operator]
      equation = `${num1}${mathSymbols[operator]}`;
    } 
    renderCurrentOutput(equation);
  })    
})

// Gives clear button an eventlistener that calls function to clear calculator.
clearBtn.addEventListener('click', clearData);

/*
+ Eventlistener function deletes current character on the equation or output
- get the deleted character since it may provide good information, and reduce the equation by one character with slice (this will always happen).
- If the deleted character matches a property of our mathSymbols object, which means its an operator, then clear the operator because the user is deleting an oeprator on their screen.
- Else if the deleted character isn't the operator then it must mean that the operator is still there, or it has already been deleted. If the operator is still set, then we are deleting from the num2 variable, else 
we are deleting from the num1 variable.
- After we delete characters from the numbers, then check if the number still has a decimal or not so that we can decide if the user can still use the decimal button.
*/
deleteBtn.addEventListener('click', () => { 
  const DELETED_CHAR = equation.slice(equation.length - 1); 
  equation = equation.slice(0, equation.length - 1);   
  //if its the operator delete the current operator
  if (DELETED_CHAR == mathSymbols[operator]) {
    operator = "";
  } else if (operator) { 
    num2 = num2.slice(0, num2.length - 1);
    decimalCheck(num2);
  } else if (!operator) {
    num1 = num1.slice(0, num1.length - 1);
    decimalCheck(num1);
  }
  renderCurrentOutput(equation);
})

/*
+ Add an eventlistener to each digit button so that if we click on the button, we add its value to the equation. The value is decided by its data attribute which we've set in the html.
- if operator is set then we go to the second number, else the first number is the one that's being manipulated. However, regardless if the operator is set or not, the value of the button must be added to the
equation variable, which is responsible for the visuals only, while the num1 and num2 are involved in actual calculations and math.
- After adding a digit value (0-9) or a decimal (.) to num1 or num2 we need to check if the number has a decimal in it to see if the user is able to use the decimal button or not.
*/
digitBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const BTN_VALUE = e.currentTarget.dataset.value;
    if (operator) { 
      num2 += BTN_VALUE;
      decimalCheck(num2);
    } else {
      num1 += BTN_VALUE; 
      decimalCheck(num1);
    } 
    equation += BTN_VALUE;
    renderCurrentOutput(equation);
  })
})