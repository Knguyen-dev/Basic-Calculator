/*
1. Create functions for add, subtract, multiply, and divide
2. create function operate(operator, num1, num2) that calls one of the above functions
3. Create buttons for hte digits, functions and calculate (equals key)
4. Create a display and functions that shows the numbers when things are being pressed; store the value of the display in a variable
5. Create a clear button
6. Round the numbers so decimals 
7. Do error handling for when someone presses equals too early 
8. Pressing clear should wipe out all existing data, like a real clear
9. Display a message when the user divides by 0 and handle the error so that the calculator doesn't crash.
10. Let the user have decimal or floating points, however make sure they can't type more than one since things like "12.3.45" could happen. So disable the button when there's a decimal 
already in the display
11. Add a backspace
12. Add keyboard support, be care ful some keys like '/' don't behave properly so event.preventDefault() will be used to solve the problem
+ Or something similar
- Store the first number when the user presses an operator and save the operation that was chosen, then call the operate function when the equal button is pressed.
Several operations should be able to be done in a row: 12 + 7 - 5 * 3 = 42; okay looks worrying but please wait for the explanation.
NOTE: Only a pair of numbers should be on screen at a time. Let's say you press 12 then plus then 7 then minus. First it should 12 + 7 to get 19, and then 19 - something
maybe create an object called equationinput that will record a specific input 
*/

// Output section
const previousOutputEl = document.getElementById('previous-output');
const currentOutputEl = document.getElementById('current-output'); 

// Various buttons
const clearBtn = document.getElementById('clear-btn');
const deleteBtn = document.getElementById('delete-btn');
const digitBtns = document.querySelectorAll('.digit-btn');
const arithmeticBtns = document.querySelectorAll('.arithmetic-btn');
const equalBtn = document.getElementById('equal-btn');

// Boolean that controls the decimal button
let decimal_btn_enabled = true;

// Boolean that records if an error happens
let error_detected = false;

// Boolean for the recording when the equals btn was used
let used_equals_btn = false;

// Still need to create a class called equationEntry; start index at -1, because when we have one entry 
let equationHistory = [];
let equationIndex = -1;
// The first and second numbers; the first number acts as a total whilst the second number is added onto the first number
let num1 = "";
let num2 = "";
let operator = "";
let equation = "";

// Mathsymbols
const mathSymbols = {
  'mod': '%',
  'divide': '/',
  'multiply': 'x',
  'subtract': '-',
  'add': '+'
};

class equationEntry {
  constructor(firstNumber, secondNumber, operation, result) {
    this.firstNumber = firstNumber;
    this.secondNumber = secondNumber;
    this.operation = operation;
    this.result = result;
  }
}

// This function will show and soon store the previous output 
function renderPreviousOutput(firstNum, secondNum, operation, result) {
  let entry = new equationEntry(firstNum, secondNum, operation, result);
  equationHistory.push(entry);
  if (equationHistory.length == 1) { // if its the first entry then initialize the index as 0
    equationIndex = 0;
  } else { //Else, we will just increase the index since the length here will be bigger than one and increasing
    equationIndex += 1;
  }
  previousOutputEl.textContent = `${firstNum} ${mathSymbols[operation]} ${secondNum} = ${result}`;
}

// When we calculate with the arithmetic buttons it does the current equation so like 16+, or when its the equal button then its just 5; this is differentiated from the render previous function
// If error_detected is true, then we won't render any equation, but if its false, then we will render equations like normal.
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
  // Convert the numbers (type string) into type float
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
  if (!Number.isInteger(result) && typeof(result) !== 'String') {
    result = Number(result).toFixed(3); //Number(something).toFixed(value) is the right format
  }
  renderPreviousOutput(firstNum, secondNum, operation, result);
  return result.toString();
};

function decimalCheck(num) {
  if (num.includes('.')) {
    disableDigitBtns(true, 'decimal');
  } else {
    disableDigitBtns(false, 'decimal');
  }
}

// Functions that disable or enable the arithmetic or the digit btns
// Our parameter range will default be 'all' to indicate whether all of the btns are being targeted, but the argument 'decimal' could be passed to the range parameter, which will just control whether the decimal
// button is enabled or disabled.
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

// Function enables or disables the arithmetic buttons
function disableArithmeticBtns(bool) {
  arithmeticBtns.forEach(btn => {
    btn.disabled = bool
    if (bool) { //if we want to disable the button then we tag on the disabled button class, and indicate its disabled
      btn.classList.add('button-disabled');
    } else {   //if its false then we are enabling the button, so we have to indicate the button enabled.
      btn.classList.remove('button-disabled');
    }
  });
}

// Function clears the data. Clears both numbers, operator, and the equation
// If there was an error that was triggered then the user would be lead to execute this function, which 
// allows buttons to be clicked again after being disabled.
function clearData() {
  num1 = "";
  num2 = "";
  operator = "";
  equation = "";
  error_detected = false; //reset the error boolean as well
  renderCurrentOutput(equation); //Since equation is blank and error_detected is false, it will render nothing.
  disableDigitBtns(false);
  disableArithmeticBtns(false); 
  equalBtn.classList.remove('button-disabled');
  deleteBtn.classList.remove('button-disabled');
  equalBtn.disabled = false;
  deleteBtn.disabled = false;
}
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
- If they press the minus button on the first number then its going to be a negative number. 
- If (num1 is empty and the btnID is minus or subtract): then make num1 a negative version which would be adding '-' to num1
*/
arithmeticBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btnID = e.currentTarget.dataset.id;

    // If they used the equal btn then the digit btns would have gotten disabled. The user would be lead to click the arithmetic buttons
    // If they click the arithmetic buttons, check if they used the equals btn. If they do then turn that boolean to false and call the function to disable the digit buttons.
    if (used_equals_btn) {
      used_equals_btn = false;
      disableDigitBtns(false);
    }

    // Checks if num1 is an empty string; also makes sure that the value of num1 is not '0' in order to make sure num1 is not zero.
    // Does the same thing, but checks for an operator as well, if its the operator then we are working on the second number 
    if ((num1 == false && num1 !== '0') || ((num2 == false && num2 !== '0') && operator)) { //second clause makes it possible for subtract to go through

      //if it isn't subtraction then they aren't negating, which means they are putting in an incorrect value
      if (btnID == 'subtract') {        
        // If the operator is set then we are working on the second number, else we are working on the first number
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
      // if we are going to do this, then we should remove that clause that changes the arithmetic automatically, and leave that to the delete button
      // This means they are using the minus operator before filling in num1, which means they are trying to have a negative version of num1
      // In this case an operator is not set for the equation, but we are simply negating; right now we are working on negating the first number
      // And I think we only need to update the num1 variable, and the equation variable since we aren't doing anything with an operator or num2.
      
    } else if (!operator) { 
      // [number] [operator] situation; If there is no operator then they are just setting a new operator
      // set the operator as the id, and add the operator onto the equation to be displayed
      operator = btnID; 
      equation += mathSymbols[operator];

    // If there's an operator, and num2 has length, and num2 is not a zero, then we know that num2 is an actual non-zero number
    // Operator is already set  [number] [operator] [number] [new operator] situation
    // Assign num1 to the result, empty num2 because it's been calculated, assign operator to the ID of the btn, and update the equation variable. 
    } else if (operator && (num2.length > 0 && parseFloat(num2) !== 0)) {

      num1 = calculate(num1, num2, operator);
      num2 = "";      
      operator = btnID; //set the new [operator]
      equation = `${num1}${mathSymbols[operator]}`;

    } else if (operator && (num2 == false)) {
      
      // Checks if Operator exists and num is a false value. Situation is [number] [operator] [0 or a null value] [new operator]
      // Make sure if num2 (type string) is a zero, to check if num2 is the number 0.
      //Do the same thing, as the above clause them.
      if (num2 === '0') { 
        num1 = calculate(num1, num2, operator);
        num2 = "";
        operator = btnID; //set the new operator
        equation = `${num1}${mathSymbols[operator]}`;
      } 
    }
    // After equation, numbers, and operator have been updated, then render the new equation.
    renderCurrentOutput(equation);
  })    
})

// Calls function to clear calculator.
clearBtn.addEventListener('click', clearData);

deleteBtn.addEventListener('click', () => { //get the deleted character, if the character matches a piece of a number then change the number
  const DELETED_CHAR = equation.slice(equation.length - 1); //get the deleted character since it may provide good information
  equation = equation.slice(0, equation.length - 1); //reduce the equation, this is guaranteed  
  //if its the operator delete the current operator
  if (DELETED_CHAR == mathSymbols[operator]) {
    operator = "";
  } else if (operator) { //else if the operator still exists then we are deleting something from the second number
    num2 = num2.slice(0, num2.length - 1);
    decimalCheck(num2); //could have deleted a decimal so do a decimal check
  } else if (!operator) {
    num1 = num1.slice(0, num1.length - 1);
    decimalCheck(num1);
  }
  renderCurrentOutput(equation);
})

// Have the decimal checker in the delete button
digitBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const BTN_VALUE = e.currentTarget.dataset.value;
    // if operator is set then we go to the second number else the first number
    // Or if the user used the equal btn to calculate an answer
    if (operator) { 
      num2 += BTN_VALUE;
      decimalCheck(num2); //once it switches to the second number then decimal check is going to be reset since num2 has no decimal.
    } else {
      num1 += BTN_VALUE; //user enters the period and after we check and disable. 
      decimalCheck(num1);
    } 
    equation += BTN_VALUE;
    renderCurrentOutput(equation);
  })
})

document.addEventListener('keydown', e => {
  const KEY_CODE = e.code;
  let keyValue;
  switch(KEY_CODE) {
    case 'Numpad0':
      keyValue = 0;
      break;
    case 'Numpad1':
      keyValue = 1;
      break;
    case 'Numpad2':
      keyValue = 2;
      break;
    case 'Numpad3':
      keyValue = 3;
      break;
    case 'Numpad4':
      keyValue = 4;
      break;
    case 'Numpad5':
      keyValue = 5;
      break;
    case 'Numpad6':
      keyValue = 6;
      break;
    case 'Numpad7':
      keyValue = 7;
      break;
    case 'Numpad8':
      keyValue = '8';
      break;
    case 'Numpad9':
      keyValue = 9;
      break;
    case 'NumpadDecimal':
      keyValue = '.';
      break;

    // Buttons for add, subtract, multiply, divide, modulo, delete, equal, and clear
    case 'ArrowUp':
      keyValue = '.';
      break;
    case 'ArrowDown':
      keyValue = '.';
      break;
    case 'NumpadAdd':
      keyValue = '.';
      break;
    case 'NumpadSubtract':
      keyValue = '.';
      break;
    case 'NumpadMultiply':
      keyValue = '.';
      break;
    case 'NumpadDivide':
      keyValue = '.';
      break;
    case 'NumpadEnter':
      keyValue = "Enter";
      break;
    case 'Digit5': //can't really have percent so this is the best we could do
      keyValue = 'Modulo';
      break;
  }
})