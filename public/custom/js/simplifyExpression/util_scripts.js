var premises = [],
    conclusion,
    operators = 'NKCAB',
    unaryOperators = 'N',
    binaryOperators = 'KCAB',
    unaryOperatorsLong = ['not'],
    binaryOperatorsLong = ['and','or','implies','if', 'only if']
    tableWidth = 100,
    showList = [],
    lightList = [],
    lineList = [],
    currentLogic ='NM';

function translate(inputString) {
    // Translate standard logic notation into Polish notation
    
    // If the string is an atomic proposition, return the string
    var count = 0;
    if (inputString.length === 1) {
        if (/[a-z]/.test(inputString)) {
            return inputString;
        } else {return false;}
    };
    // Trim leading whitespace
    if (/^\s/.test(inputString)) {
        return translate(inputString.slice(1));
    };
    // Trim trailing whitespace
    if (/\s$/.test(inputString)) {
        return translate(inputString.slice(0,-1));
    };
    // Trim extra leading or trailing paren
    if (inputString[0] === '(') {
        if (inputString.match(/\)/g) === null) {
            return translate(inputString.slice(1));
        } else if (inputString.match(/\(/g).length === 
                   inputString.match(/\)/g).length+1) {
            return translate(inputString.slice(1));
        };
    };
    if (inputString[-1] === ')') {
        if (inputString.match(/\(/g) === null) {
            return translate(inputString.slice(1));
        } else if (inputString.match(/\)/g).length === 
                   inputString.match(/\(/g).length+1) {
            return inputString.slice(0,-1);
        };
    };
    // Trim unnecessary parens
    if (inputString[0] === '(') {
        var count = 0
        loop1:
            for (var l=0;l<inputString.length;l++) {
                var letter = inputString[l];
                if (letter === '(') {
                    count++;
                } else if (letter === ')') {
                    count--;
                };
                if (count === 0) {
                    if (l === inputString.length-1) {
                        return translate(inputString.slice(1,-1));
                    };
                    break loop1;
                };
            };
    };
    
	// Translate 'not...' to 'N...'
    if (/not/i.test(inputString.slice(0,3))) {
        return 'N'+translate(inputString.slice(4));
    };
    // Translate 'Nec'
    if (/nec/i.test(inputString.slice(0,3))) {
        return 'M'+translate(inputString.slice(4));
    };
    // Translate 'Poss'
    if (/poss/i.test(inputString.slice(0,4))) {
        return 'L'+translate(inputString.slice(5));
    };
    // Translate 'if..then...' to 'C...'
    if (/if/i.test(inputString.slice(0,2))) {
        var count = 0;
        for (var l=0;l<inputString.length;l++) {
            var letter = inputString[l];
            if (letter === '(') {
                count++;
            } else if (letter === ')') {
                count--;
            };
            if (count === 0 && inputString.slice(l,l+4) === 'then') {
                return 'C' + translate(inputString.slice(3,l-1)) + translate(inputString.slice(l+5));
            };
        };
    };
    // Translate other connectives
    var count = 0;
    for (var l=0;l<inputString.length;l++) {
        var letter = inputString[l];
        if (letter === '(') {
            count++;
        } else if (letter === ')') {
            count--;
        };
        if (count === 0) {
            if (/and/i.test(inputString.slice(l,l+3))) {
                return 'K' + translate(inputString.slice(0,l-1)) + 
                    translate(inputString.slice(l+4));
            };
            if (/or/i.test(inputString.slice(l,l+2))) {
                return 'A' + translate(inputString.slice(0,l-1)) + 
                    translate(inputString.slice(l+3));
            };
            if (/implies/i.test(inputString.slice(l,l+7))) {
                return 'C' + translate(inputString.slice(0,l-1)) +
                    translate(inputString.slice(l+8));
            };
            if (/only\sif/i.test(inputString.slice(l,l+7))) {
                return 'C' + translate(inputString.slice(0,l-1)) +
                    translate(inputString.slice(l+8));
            };
            if (/iff/i.test(inputString.slice(l,l+3))) {
                return 'B' + translate(inputString.slice(0,l-1)) +
                    translate(inputString.slice(l+4));
            };
            if (/if\sand\sonly\sif/i.test(inputString.slice(l,l+14))) {
                return 'B' + translate(inputString.slice(0,l-1)) +
                    translate(inputString.slice(l+15));
            };
            if (/if\s/i.test(inputString.slice(0,l+3))) {
                return 'C' + translate(inputString.slice(0,l-1)) +
                    translate(inputString.slice(l+3));
            };
        };
    };
};

function reverseTranslate(inputRPN){
    // Reverse translate Polish notation back to standard logic notation
    var stack = [];
    var result = "";
    // length of the RPN
    var length = inputRPN.length;

    // If the string is a atomic proposition, return the string
    if (inputRPN.length === 1) {
        if (/[a-z]/.test(inputRPN)) {
            return inputRPN;
        } else {return false;}
    };

    //Reading from right to left
    for ( var i = length-1; i >= 0; i--){

        // Check if current char is a binary operator
        if(isBinaryRPNOperator(inputRPN[i])){

            //Pop two operands from the top
            var op1 = stack[stack.length-1];
            stack.pop();
            var op2 = stack[stack.length-1];
            stack.pop();

            //Get standard operator
            var operator = getStandardOperator(inputRPN[i]);
            //Concat the operands and operator
            var temp = "("+ op1 + " " + operator + " " + op2 + ")";

            //Push string temp back to stack
            stack.push(temp);
        }

        //If current char is unary operator (like 'N')
        else if (inputRPN[i] === 'N'){
            //Pop just one operand from the top
            var op1 = stack[stack.length-1];
            stack.pop();

            //Get standard operator
            var operator = getStandardOperator(inputRPN[i]);
            //Concat the operands and operator
            var temp = operator + op1;

            //Push string temp back to stack
            stack.push(temp);
        }

        //if current char is operand
        else{
            //push operand to the stack
            var operand = inputRPN[i];
            stack.push(operand);
        }
    }

    result = stack[stack.length-1];
    // If the begining is a parenthese, trim leading parenthese
    if (/^\(/.test(result)) {
        result = result.slice(1);
        // and then trim trailing parenthese
        if (/\)$/.test(result)) {
          result = result.slice(0,-1);
      };
    };

    return result;
}


function validateInput(string1) {
    // Checks if the string is a valid proposition in Polish notation
    // Check if the string contains any illegal characters
    var re = /^[a-zLMNKABC]*$/,
        result;
    if (!re.test(string1)) {
        result = false;
    // Check if the string is an atomic proposition
    } else if (string1.length==1) {
        if (string1.match(/[a-z]/) !== null) {
            result = true;
        } else {
            result = false;
        };
    // Make sure the operators and arguments are appropriate
    } else {
        var counter = 1;
        for (i=0;i<string1.length;i++) {
            if (binaryOperators.indexOf(string1[i])>-1) {
                counter++;
            } else if (string1[i].match(/[a-z]/) !== null) {
                counter--;
            };
        };
        if (counter == 0) {
            result = true;
        } else {
            result = false;
        };
    };
    if (currentLogic === 'NM') {
        if (/[LM]/.test(string1)) {
            alert("Modal operators are not allowed in non-modal logic");
            result = false;
        };
    };
    if (result == false) {
        return false;
    } else {
        return true;
    };
};

function isBinaryRPNOperator(x){
    switch(x){
        case 'K':
        case 'A':
        case 'C':
        case 'B':
            return true;
    }
    return false;
}

function getStandardOperator(RPNoperator){
    switch (RPNoperator) {
        case 'N':
            return '&not;';
            break;
        case 'C':
            return '&rarr;';
            break;
        case 'K':
            return '&and;';
            break;
        case 'A':
            return '&or;';
            break;
        case 'B':
            return '&harr;';
            break;
    }
}

