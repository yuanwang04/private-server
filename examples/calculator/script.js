class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' && this.previousOperand === '') return;
        
        // If current is empty but we have previous, just change the operation
        if (this.currentOperand === '' && this.previousOperand !== '') {
            this.operation = operation;
            return;
        }

        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                // Handle divide by zero
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Handle floating point precision issues
        computation = Math.round(computation * 10000000000) / 10000000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        if (number === '') return '';
        
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
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            // Replace * with × and / with ÷ for display
            let displayOp = this.operation;
            if (this.operation === '*') displayOp = '×';
            if (this.operation === '/') displayOp = '÷';
            
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${displayOp}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandTextElement = document.getElementById('previous-operand');
    const currentOperandTextElement = document.getElementById('current-operand');
    
    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add click animation
        button.addEventListener('mousedown', () => {
            button.classList.add('pressed');
        });
        
        button.addEventListener('mouseup', () => {
            button.classList.remove('pressed');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('pressed');
        });

        button.addEventListener('click', () => {
            if (button.classList.contains('btn-number')) {
                calculator.appendNumber(button.dataset.value);
                calculator.updateDisplay();
            }
            
            if (button.classList.contains('btn-operator')) {
                calculator.chooseOperation(button.dataset.value);
                calculator.updateDisplay();
            }
            
            if (button.classList.contains('btn-equals')) {
                calculator.compute();
                calculator.updateDisplay();
            }
            
            if (button.dataset.action === 'clear') {
                calculator.clear();
                calculator.updateDisplay();
            }
            
            if (button.dataset.action === 'delete') {
                calculator.delete();
                calculator.updateDisplay();
            }
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', e => {
        if (e.key >= 0 && e.key <= 9 || e.key === '.') {
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
        }
        if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission or other defaults
            calculator.compute();
            calculator.updateDisplay();
        }
        if (e.key === 'Backspace') {
            calculator.delete();
            calculator.updateDisplay();
        }
        if (e.key === 'Escape') {
            calculator.clear();
            calculator.updateDisplay();
        }
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            calculator.chooseOperation(e.key);
            calculator.updateDisplay();
        }
    });
});
