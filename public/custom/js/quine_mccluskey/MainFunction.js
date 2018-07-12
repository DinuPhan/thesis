// this is the main file for the program
// it controls the fllow of functions calling

var minTerms;
var dontCares;
var numberOfInputs;
var groupLists;
var primeImplicants;
var resultImplicants;
var solutions;
var specialcase;
var remainingImplicants;
var uncoveredMinTerms;
var eliminationRecords;
var essentialImplicants;
var uniqueMinTermsPositions;

function main() {

    //initialize our Arrays
    minTerms = [];
    dontCares = [];
    groupLists = [[]];
    primeImplicants = [];
    resultImplicants = [];
    solutions = [];
    solutionsExpressions = [];
    eliminationRecords = new Array();
    essentialImplicants = new Array();
    uniqueMinTermsPositions = new Array();
    //Part 0
    readInput(); //put them in Array minTerms & dontCares

    if (inputIsValid()) {
        setNumberOfInputs();
    } else {
        printError();
        return;
    }

    //special cases
    specialcase = false;
    if (minTerms.length == 1 && dontCares.length == 0 && minTerms[0] == 0) {
        solutionsExpressions = ["A'"];
        specialcase = true;
    } else if (minTerms.length == 0) {
        solutionsExpressions = ["0"];
        if (dontCares.length != 0 && dontCares.length == Math.pow(2, numberOfInputs)) {
            solutionsExpressions.push("1");
        }
        specialcase = true;
    } else if ((minTerms.length + dontCares.length) == Math.pow(2, numberOfInputs)) {
        solutionsExpressions = ["1"];
        specialcase = true;
    }
    if (specialcase) {
        printOutput();
        clearSteps();
        return;
    }

    //Part 1

    initializeGroupList();
    initializeGroups();
    var i = 0;
    do {
        groupLists[i + 1] = [];
        var generatedGroupList = groupingProcess(groupLists[i], groupLists[i + 1]);
        // console.log(generatedGroupList)
        i++;
    } while (!isEmptyGroupList(generatedGroupList));
    groupLists.pop();

    //Part 2
    console.log('groupLists',groupLists,'primeImplicants',primeImplicants,'resultImplicants',resultImplicants);
    console.log('solutions',solutions,'specialcase',specialcase);
    eliminationProcess();
   

    //part 3
    minimalSolutions = undefined;
    if (uncoveredMinTerms.length > 0) {
        branchingProcess();
    }

    if (minimalSolutions != undefined) {
        for (var i = 0; i < minimalSolutions.length; i++) {
            solutions.push(resultImplicants.concat(minimalSolutions[i]));
        }
    } else {
        solutions.push(resultImplicants);
    }

    printOutput();
    clearSteps();
    printSteps();

}

// console.log('minterm ne',document.getElementById('Minterms'));
// document.getElementById('Minterms').addEventListener('change',function(event){
//     event.preventDefault();
//     //Keycode 13 = Enter
//     console.log('tao vo ne');
//     if(isNaN(this.value)){
//         console.log('tao vo ne');
//         if(event.keyCode === 13){
//             console.log('tao vo ne');
//             main();
//         }
//     }
// });