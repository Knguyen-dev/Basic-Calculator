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
const calculateBtn = document.getElementById('equal-btn');
const digitBtns = document.querySelectorAll('.digit-btn');
const arithmeticBtns = document.querySelectorAll('.arithmetic-btn');

let firstNum = "";
let secondNum = "";
let currentOperator;

// Count the number in the javascript and then visually count the number on
// the webpage

digitBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const BTN_VALUE = e.currentTarget.dataset.value;
    firstNum += BTN_VALUE;

    currentOutputEl.textContent = firstNum;
  })
})