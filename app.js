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

const previousOutputEl = document.querySelector('.previous-output');
const currentOutputEl = document.querySelector('.current-output');

const clearBtn = document.getElementById('clear-btn');
const deleteBtn = document.getElementById('delete-btn');
let decimal_btn_enabled = true;

const digitBtns = document.querySelectorAll('.digit-btn');
const arithmeticBtns = document.querySelectorAll('.arithmetic-btn');
const equalBtn = document.getElementById('equal-btn');

let num1 = "";
let num2 = "";
let operator = "";
let used_equal_btn = false;
// Have the math icons and numbers here for the visual, but 
// Have the actual numbers and operators in other variables
let equation = "";


// If I add by 0 it displays weird change it
// Both of these numbers should be strings
function calculate(num1, num2, operation) {
  console.log(`Calculation trigged num1: ${num1} and num2: ${num2}, operator: ${operator}`);
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);
  let result;
  if (operation == "add") {
    result = num1 + num2;
  } else if (operation == "subtract") {
    result = num1 - num2;
  } else if (operation == "multiply") {
    result = num1 * num2;
  } else { //all left is division and modulo; if we are dividing by zero then show an error and return nothing, else do the regular math
    if (num2 === 0) {
      displayError('DivisionError');
      // return ""; reset the num1 string
    } else {
      switch(operation) {
        case "divide":
          result = num1 / num2;
          break;
        case 'mod':
          result = num1 % num2;
          break;
      }
    }
  }
  // if it isn't an integer and it isn't a string then we can round it
  if (!Number.isInteger(result)) {
    result = result.toFixed(3);
  }
  return result.toString();
};

function displayError(errorType) {
  currentOutputEl.textContent = errorType;
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

// When both numbers exist and an operator exists
equalBtn.addEventListener('click', function() {
  if ((num1.length > 0 && num2.length > 0) && (operator)) {
    num1 = calculate(num1, num2, operator);
    num2 = "";
    operator = "";
    equation = num1;
    renderOutput(equation);
  } else {
    displayError("Equation Error");
  }
})


/*
- To my understanding: Let them enter in num1. They are finished entering when operator is selected and set
the operator. Then switch to the entering to num2; Now if they press equals then they get the answer, however if they press another 
operator: 
- Before assigning a new operator, check if the two numbers are full, calculate with the current operator of the 
two numbers. Get the result and put in num1 and now we can set the next operator

- This seems good in terms of adding in the form of num1 [operator] num2 [new operator]. Obviously we haven't done any thorough error
handling but it seems good. If it's bad then it's doing a good job hiding it from me. Next would be working on the equal or submit button

*/

arithmeticBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btnID = e.currentTarget.dataset.id;
    const mathSymbols = {
      'mod': '%',
      'divide': '/',
      'multiply': 'x',
      'subtract': '-',
      'add': '+'
    };

    // if there's no number then that's an error; a [missing number] [arithmetic operator] situation
    // Strict equality since 0 is also consider a false value; avoids 0 [operator] causing a division error
    if (num1 === false) {
      displayError("Missing Number Error");
    } else if (!operator) { 
      // number [operator]; situation where they just setting a new operator
      operator = btnID;
      equation += mathSymbols[operator];
    } else {
    // Else they are correctly calculating an equation
      if (operator && (num2.length > 0 && parseFloat(num2) !== 0)) { //num2 is a real string so its a real number
        // If the operator is already set then you have a 2 + 2 [operator] situation so you have to 
        // Handle the calculation before reassigning that operator in case user ignores the equal button
        // remember to empty num2 since it has just been calculated; parseFloat is needed to make sure it isn't a zero value, but its a real number with digits
        num1 = calculate(num1, num2, operator);
        num2 = "";      
        operator = btnID; //set the new [operator]
        equation = `${num1}${mathSymbols[operator]}`;


      } else if (operator && (num2 == false)) {
        // Equation: [number] [operator] [0 or a null value] and then user is adding a [new operator]
        // Strict equality operator and parseInt is needed to make sure it is actually the value 0
        // Else if we don't do this then num2 is empty then the first clause will be triggered always
        if (num2 === '0') { //If its a zero then we have a [number] [operator] 0 [new operator];
          num1 = calculate(num1, num2, operator);
          num2 = "";
          operator = btnID; //set the new operator
          equation = `${num1}${mathSymbols[operator]}`;
          

        } else {
          //Else if not zero it's a regular null or empty value do the regular thing of changing the operator in the logic and visually
          const LAST_INDEX = equation.length - 1;
          equation = equation.slice(0, LAST_INDEX); //get rid of old operator could just do .slice(equation.length - 1) since we know operator will be at end of string
          operator = btnID; //set new operator
          equation += mathSymbols[operator];
        }
      }
    }
    
    renderOutput(equation);
  })
})

function renderOutput(output) {
  output = output.toString(); //Ensure that the output or data being rendered is actually a string so we can do tests with it
  currentOutputEl.textContent = output; 
  console.log(`${num1} ${num2} ${operator} ${equation}`);
}

// Function clears the data. Clears both numbers, operator, and the equation
// If there was an error that was triggered then the user would be lead to execute this function, which 
// allows buttons to be clicked again after being disabled.
function clearData() {
  num1 = "";
  num2 = "";
  operator = "";
  equation = "";
  currentOutputEl.textContent = "";

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

// Clears the equation on screen alongside num1 and num2 let user start out fresh.
clearBtn.addEventListener('click', clearData);

deleteBtn.addEventListener('click', () => { //get the deleted character, if the character matches a piece of a number then change the number
  const DELETED_CHAR = equation.slice(equation.length - 1); //get the deleted character since it may provide good information
  equation = equation.slice(0, equation.length - 1); //reduce the equation, this is guaranteed  
  //if its the operator delete the current operator
  if (DELETED_CHAR == operator) {
    operator = "";
  } else if (operator) { //else if the operator still exists then we are deleting something from the second number
    num2 = num2.slice(0, num2.length - 1);
    decimalCheck(num2); //could have deleted a decimal so do a decimal check
  } else if (!operator) {
    num1 = num1.slice(0, num1.length - 1);
    decimalCheck(num1);
  }

  console.log(`Delete action => num1: ${num1} num2: ${num2} operator: ${operator}`);
  renderOutput(equation);
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
      decimalCheck(num2);
    } else {
      num1 += BTN_VALUE; //user enters the period and after we check and disable. 
      decimalCheck(num1);
    } 
    equation += BTN_VALUE;
    console.log(`num1: ${num1} num2:${num2} operator: ${operator}`);
    renderOutput(equation);
  })
})

