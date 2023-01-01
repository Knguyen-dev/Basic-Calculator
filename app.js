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
1. 12 + 7 = 19
2. 19 - 5 = 14
3. 14 * 3 = 42
*/

const previousOutputEl = document.querySelector('.previous-output');
const currentOutputEl = document.querySelector('.current-output');

const clearBtn = document.getElementById('clear-btn');
const deleteBtn = document.getElementById('delete-btn');
const decimalBtn = document.getElementById('decimal-btn');
let decimal_btn_enabled = true;

const calculateBtn = document.getElementById('equal-btn');
const digitBtns = document.querySelectorAll('.digit-btn');
const arithmeticBtns = document.querySelectorAll('.arithmetic-btn');

// const modulusBtn = document.getElementById('modulus-btn');
// const divideBtn = document.getElementById('division-btn');
// const multiplyBtn = document.getElementById('multiplication-btn');
// const subtractBtn = document.getElementById('subtraction-btn');
// const addBtn = document.getElementById('addition-btn');

let num1 = "";
let num2 = "";

let operator = "";

// Have the math icons and numbers here for the visual, but 
// Have the actual numbers and operators in other variables
let equation = "";


// If I add by 0 it displays weird change it
// Both of these numbers should be strings
function calculate(num1, num2, operation) {
  console.log(`Calculation trigged num1: ${num1} and num2: ${num2}`);
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);
  let result;
  if (operation == "add") {
    result = num1 + num2;
  } else if (operation == "subtract") {
    result = num1 - num2;
  } else if (operation == "multiply") {
    result = num1 * num2;
  } else if (operation == 'divide') {
    result = (num1 / num2);
  } else {
    result = num1 % num2;
  }
  // if it isn't an integer then round it; This can happen outside of division so we want a full guard
  // 9 / 2 is 4.5 then if we multiplied by 0.15 then it would be a very long decimal. Other ways to produce these decimals are possible
  // So we will stop them here
  if (!Number.isInteger(result)) {
    result = result.toFixed(2);
  }
  return result;
};




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
      'mod': 'MOD',
      'divide': '/',
      'multiply': 'x',
      'subtract': '-',
      'add': '+'
    };
    
    if (num1 == false) {
      // or a better idea would be leaving everything to an error handling function
      // if there's no number then that's an error;
      equation = "Error no number inputted";
      renderOutput(equation);
    } else if (operator && num2.length > 0) {
      // If the operator is already set then you have a 2 + 2 [operator] situation so you have to 
      // Handle the calculation before reassigning that operator in case user ignores the equal button
      // remember to empty num2 since it has just been calculated
      num1 = calculate(num1, num2, operator).toString();
      num2 = "";      
      operator = btnID; //set the new [operator]
      equation = `${num1}${mathSymbols[operator]}`;
    } else if (operator && (num2 == false)) {         //this would be [number] + [missing number or 0] [new operator]; so a user would press this to change the operator only      
      console.log(`Second clause triggered since num2: ${num2}`);
      if (num2 === 0) { //If its a zero then we have a [number] + 0 [new operator];
        console.log(`num2: ${num2} is detected as zero`);
        if (operator == 'divide' || 'mod') { //If we are dividing or modulo by zero then its an error
          equation = `Division Error since ${operator} by 0`;
          renderOutput(equation);
        } else { //Else do the regular math 
          num1 = calculate(num1, num2, operator).toString();
          num2 = "";
          operator = btnID; //set the new operator
          equation = `${num1}${mathSymbols[operator]}`;
        }
        
        //Else if not zero do the regular thing of changing the operator in the logic and visually
      } else {
        const LAST_INDEX = equation.length - 1;
        equation = equation.slice(0, LAST_INDEX); //get rid of old operator could just do .slice(equation.length - 1) since we know operator will be at end of string
        operator = btnID; //set new operator
        equation += mathSymbols[operator];
      }
      console.log('Second condition clause was hit');
    } else if (!operator) {
      operator = btnID;
      equation += mathSymbols[operator];
    }
    
    
    renderOutput(equation);
  })
})

function renderOutput(output) {
  currentOutputEl.innerHTML = output;
  // Checks if decimal is in there
  if (output.includes('.')) {
    decimalBtn.disabled = true;
  } else {
    decimalBtn.disabled = false;
  }
}
decimalBtn.addEventListener('click', function() {
  equation += '.';
  renderOutput(equation);
})

// Clears the equation on screen alongside num1 and num2 let user start out fresh.
clearBtn.addEventListener('click', () => {
  num1 = "";
  num2 = "";
  operator = "";
  equation = "";
  renderOutput(equation);
});
deleteBtn.addEventListener('click', () => {
  equation = equation.slice(0, equation.length - 1);
  renderOutput(equation);
})


digitBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const BTN_VALUE = e.currentTarget.dataset.value;
    
    // if operator is set then we go to the second number else the first number
    if (operator) {
      num2 += BTN_VALUE;
    } else {
      num1 += BTN_VALUE;
    }
    
    equation += BTN_VALUE;
    renderOutput(equation);
  })
})