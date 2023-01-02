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


// Still need to create a class called equationEntry
let equationHistory = [];


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

/*
+ Function handles the calculation of two numbers, passed in as strings, and an operator
- Converts the arguments into floating point numbers and handles the math accordingly. 
- After it rounds it out if the result is it isn't an integer.
- Finally it returns the result as a string
*/
function calculate(firstNum, secondNum, operation) {
  console.log(`Calculation trigged num1: ${firstNum} and num2: ${secondNum}, operator: ${operation}`);
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

// This function will show and soon store the previous output 
function renderPreviousOutput(firstNum, secondNum, operation, result) {
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
  console.log(`Error: ${errorType}`);
  currentOutputEl.textContent = errorType;
  error_detected = true; //set this to true so that the main rendering function doesn't render something that overwrites the 
  // Disable all buttons except for the clear button, but also when clear button is pressed we re-enable all buttons again
  digitBtns.forEach(btn => {
    btn.classList.add('button-disabled');
    btn.disabled = true;
  })
  arithmeticBtns.forEach(btn => {
    btn.classList.add('button-disabled');
    btn.disabled = true;
  })
  equalBtn.classList.add('button-disabled');
  deleteBtn.classList.add('button-disabled');
  equalBtn.disabled = true;
  deleteBtn.disabled = true;
}

/*
+ Eventlistenerwith the equal btn handles calculations made with the equal button
- Checks if the first and second number (which are strings) have a length greater than 1. If this is true then the user entered numbers instead of leaving the numbers blank.
- Also checks if the operator variable has a value, which means if the user has entered an operator alongside those two numbers.
1. Calculate the result and have num1 equal to the result. Clear num2 and the operator. Have the equation that's going to be displayed as num1 because that's the mathematical result
that's going to be displayed. Call a function to render the equation.
2. If the first conditional isn't met, then there's an error with the equation.
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
  digitBtns.forEach(btn => {
    btn.classList.remove('button-disabled');
    btn.disabled = false;
  })
  arithmeticBtns.forEach(btn => {
    btn.classList.remove('button-disabled');
    btn.disabled = false;
  })
  equalBtn.classList.remove('button-disabled');
  deleteBtn.classList.remove('button-disabled');
  equalBtn.disabled = false;
  deleteBtn.disabled = false;
}

// Calls function to clear calculator.
clearBtn.addEventListener('click', clearData);

// Check delete button because I don't it's properly deleting numbers; 6+6 then delete to 6 then adding + will result error

deleteBtn.addEventListener('click', () => { //get the deleted character, if the character matches a piece of a number then change the number
  const DELETED_CHAR = equation.slice(equation.length - 1); //get the deleted character since it may provide good information
  equation = equation.slice(0, equation.length - 1); //reduce the equation, this is guaranteed  
  //if its the operator delete the current operator

  console.log(`Deleted Char: ${DELETED_CHAR}, Operator: ${operator}`);

  if (DELETED_CHAR == mathSymbols[operator]) {
    console.log("Okay we deleted the operator");
    operator = "";
  } else if (operator) { //else if the operator still exists then we are deleting something from the second number
    num2 = num2.slice(0, num2.length - 1);
    decimalCheck(num2); //could have deleted a decimal so do a decimal check
  } else if (!operator) {
    num1 = num1.slice(0, num1.length - 1);
    decimalCheck(num1);
  }

  console.log(`Delete action => num1: ${num1} num2: ${num2} operator: ${operator}`);
  renderCurrentOutput(equation);
})

function decimalCheck(num) {
  if (num.includes('.')) {
    digitBtns.forEach(btn => {
      if (btn.dataset.value == '.') {
        btn.disabled = true;
      }
    })
  } else {
    digitBtns.forEach(btn => {
      if (btn.dataset.value == '.') {
        btn.disabled = false;
      }
    })
  } 
}

// Have the decimal checker in the delete button
digitBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const BTN_VALUE = e.currentTarget.dataset.value;
    // if operator is set then we go to the second number else the first number
    // Or if the user used the equal btn to calculate an answer
    if (operator) { //|| used_btn == true;
      num2 += BTN_VALUE;
      decimalCheck(num2); //once it switches to the second number then decimal check is going to be reset since num2 has no decimal.
    } else {
      num1 += BTN_VALUE; //user enters the period and after we check and disable. 
      decimalCheck(num1);
    } 
    equation += BTN_VALUE;
    console.log(`num1: ${num1} num2: ${num2} operator: ${operator}`);
    renderCurrentOutput(equation);
  })
})

