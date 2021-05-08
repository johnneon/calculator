class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previosOperand = '';
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previosOperand !== '') {
      this.compute();
    }
    if (this.operation === '√') {
      this.compute();
    }
    this.operation = operation;
    this.previosOperand = this.currentOperand;
    this.currentOperand = '';
  }

  fixDigits(value) {
    let regNull = /0*$/;
    if (Number.isInteger(value)) regNull = /.0*$/;
    return value.toFixed(14).toString().replace(regNull, "");
  }

  toNegative() {
    if (this.currentOperand === '' || this.currentOperand === '.') return;
    if (this.currentOperand < 1 && this.currentOperand > 0)
      this.currentOperand = `0` + this.currentOperand;
    this.currentOperand = this.currentOperand * -1;
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previosOperand);
    const curr = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(curr)) return;
    switch (this.operation) {
      case '+':
        computation = prev + curr
        break;
      case '-':
        computation = prev - curr
        break;
      case '*':
        computation = prev * curr
        break;
      case '÷':
        computation = prev / curr
        break;
      case 'nx':
        computation = Math.pow(prev, curr)
        break;
      default:
        return;
    }
    this.currentOperand = Number(this.fixDigits(computation));
    this.operation = undefined;
    this.previosOperand = '';
  }

  squareRoot() {
    if (
      this.currentOperand === '' ||
      this.currentOperand === '.' ||
      this.currentOperand === 0
    ) return;
    if (this.currentOperand < 0) {
      alert('You cannot subtract a root from a negative number');
      return false;
    }
    this.currentOperand = Math.sqrt(this.currentOperand);
    this.previosOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    let supString = document.createElement('sup');
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previosOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
    if (this.operation === '√') {
      this.previousOperandTextElement.innerText = '';
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand);
    }
    if (this.operation === 'nx') {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previosOperand)} `;
      this.previousOperandTextElement.appendChild(supString)
      this.previousOperandTextElement.lastChild.innerText = 'x'
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const rootButton = document.querySelector('[data-operation-root]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const negativeButton = document.querySelector('[data-negative]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (calculator.readyToReset) {
      calculator.clear();
      calculator.readyToReset = false;
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    } else {
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    }
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

rootButton.addEventListener('click', () => {
  calculator.squareRoot();
  calculator.updateDisplay();
});

negativeButton.addEventListener('click', () => {
  calculator.toNegative();
  calculator.updateDisplay();
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
  calculator.readyToReset = true;
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});