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

let userNum = "";
let total = "";
let previousOperator;
let currentOperator;

// Have the math icons and numbers here for the visual, but 
// Have the actual numbers and operators in other variables
let equation = "";

/*
- Once we press an arithmetic we store that first number. If we plus an arithmetic
we check if a number has already been stored, if a number was already stored then we 
know that we should combine the numbers in some way
*/

// Both of these numbers should be strings
function calculate(num, total, operation) {
  total = parseFloat(total);
  num = parseFloat(num);
  let result;
  if (operation == "add") {
    result = total + num;
  } else if (operation == "subtract") {
    result = total - num;
  }

  console.log(`result: ${result}`);
  return result;
};


/*
- when there are 2 numbers and arithmetic buttons are hit such as 2 + 2 ? ; then check what operator was used before, probably with string.includes something, find that operator from before and do the math on that.
Now 


*/

arithmeticBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btnID = e.currentTarget.dataset.id;
    console.log(`Total: ${total}, first num: ${userNum}, btnId or operator: ${btnID}`);
    let mathSymbol;
    if (btnID == 'mod') {
      mathSymbol = 'MOD';
    } else if (btnID == 'divide') {
      mathSymbol = '/';
    } else if (btnID == 'multiply') {
      mathSymbol = 'x';
    } else if (btnID == 'subtract') {
      mathSymbol = '-';
    } else {
      mathSymbol = '+';
    }
    currentOperator = btnID;

    // check if there is no number after then we are just changing the operation sign
    if (userNum == "") {
      console.log(equation.slice(0, equation.length - 1));
      equation = equation.slice(0, equation.length - 1) + mathSymbol;
    } else { //if there is a number after it which means if firstNum is full then add that sign
      equation += mathSymbol; 
      console.log('The other clause was activated');
    }

    total = userNum;
    userNum = "";


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

// Clears the equation on screen alongside total and userNum to let user start out fresh.
clearBtn.addEventListener('click', () => {
  total = "";
  userNum = "";
  equation = "";
  renderOutput(equation);
});
deleteBtn.addEventListener('click', () => {
  equation = equation.slice(0, equation.length - 1);
  renderOutput(equation);
})
// Puts event listener on the digit buttons so that digits are added on screen
// We won't the digits into the javascript yet because user may delete or change
// Some numbers first, after we know they are pressing an arithmetic btn we know 
// they want to lock that number in, unless its delete. This can be one method
digitBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const BTN_VALUE = e.currentTarget.dataset.value;
    userNum += BTN_VALUE;
    equation += BTN_VALUE;
    renderOutput(equation);


  })
})

