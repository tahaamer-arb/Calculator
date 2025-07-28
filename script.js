const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".button, .button-operator");

let currInput = "";

buttons.forEach(button => {
    button.addEventListener("click", () => {
        let content = button.textContent;

        if (content === "C") {
            currInput = "";
            screen.textContent = "0";
        } else if (content === "=") {
            const postfix = infixToPostfix(currInput);
            const result = evaluatePostfix(postfix);
            screen.textContent = result;
            currInput = result.toString();
        } else {
            currInput += content;
            screen.textContent = currInput;
        }
    });
});

function infixToPostfix(expression) {
    let output = [];
    let operators = [];

    let i = 0;
    while (i < expression.length) {
        let char = expression[i];

        if (isDigit(char) || char === ".") {
            let number = "";
            while (i < expression.length && (isDigit(expression[i]) || expression[i] === ".")) {
                number += expression[i];
                i++;
            }
            output.push(number);
            continue;
        }

        if (isOperator(char)) {
            while (operators.length > 0 && precedence(operators[operators.length - 1]) >= precedence(char)) {
                output.push(operators.pop());
            }
            operators.push(char);
        }

        i++;
    }

    while (operators.length > 0) {
        output.push(operators.pop());
    }

    return output;
}

function evaluatePostfix(postfix) {
    let stack = [];

    postfix.forEach(token => {
        if (isOperator(token)) {
            let b = parseFloat(stack.pop());
            let a = parseFloat(stack.pop());

            switch (token) {
                case "+":
                    stack.push(a + b);
                    break;
                case "-":
                    stack.push(a - b);
                    break;
                case "*":
                    stack.push(a * b);
                    break;
                case "/":
                    stack.push(a / b);
                    break;
            }
        } else {
            stack.push(token);
        }
    });

    return stack.pop();
}

// Helpers
function isDigit(char) {
    return /\d/.test(char);
}

function isOperator(char) {
    return ["+", "-", "*", "/"].includes(char);
}

function precedence(op) {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return 0;
}