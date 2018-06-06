//At this point, we have resultImplicants array which has implicants that are in the solution
//and we have remainingImplicants array which has implicants remaining from the elimination process

//we can generate all possible combinations of the remaining implicants, filter the ones that cover
//all uncovered implicants, then choose the ones with least cost i.e number of implicants

//by the end of the branching process, we should have an array minimalSolutions which contains arrays
//of the minimal implicants needed to cover remaining minterms

var minimalSolutions;

function branchingProcess() {

    implicantsPowerSet = powerSet(remainingImplicants);
    var validSolutions = filterPowerSet(implicantsPowerSet); //array contains valid cominations
    minimalSolutions = filterPossibleSolutions(validSolutions); //array contains valid combainations with least cost

    //test
    for (var i = 0; i < minimalSolutions.length; i++) {
        console.log(printImplicantArray("MinimalSolution: ", minimalSolutions[i]));
    }
}


//generates a power set for a given array
//returns all an array of all possible combinations of implicants
function powerSet(array) {
    var powerSet = [];

    for (var i = 0; i < Math.pow(2, array.length); i++) {
        var set = [];

        for (var j = 0; j < array.length; j++) {
            if (i & (1 << j)) {
                set.push(array[j]);
            }
        }
        powerSet.push(set);
    }
    return powerSet;
}

//iterates over the power set and removes any solution that does not cover all uncoveredMinTerms
//returns an array of valid solution
function filterPowerSet(powerSet) {
    delete powerSet[0]; //now powerSet[0] = undefined
    //each invalid combaination will be undefined
    for (var i = 1; i < powerSet.length; i++) {
        if (!validCombination(powerSet[i]))
            delete powerSet[i];
    }
    return removeUndefined(powerSet);
}


//iterates over possible solutions, determines the length of the least solution possible
//then removes all solutions that are bigger and returns an array of the minimal solutions
function filterPossibleSolutions(validSolutions) {

    //determine min length
    var minlength = validSolutions[0].length;
    for (var i = 0; i < validSolutions.length; i++) {
        if (validSolutions[i].length < minlength)
            minlength = validSolutions[i].length;
    }

    for (var i = 0; i < validSolutions.length; i++) {
        if (validSolutions[i].length > minlength)
            delete validSolutions[i];
    }
    return removeUndefined(validSolutions);
}


/*----------------------------helpers-----------------------------------------------------*/
function removeUndefined(Array) {
    var temp = [];
    for (var i = 0; i < Array.length; i++) {
        if (Array[i] !== undefined) {
            temp.push(Array[i]);
        }
    }
    return temp;
}

//boolean function
function validCombination(combination) {
    //sparse boolean array
    //if this combination covers minterm -> 3
    //then covered[3] = true
    var combinationCovered = [];
    for (var i = 0; i < combination.length; i++) {
        for (var j = 0; j < combination[i].mintermsCovered.length; j++) {
            combinationCovered[combination[i].mintermsCovered[j]] = true;
        }
    }
    for (var i = 0; i < uncoveredMinTerms.length; i++) {
        if (combinationCovered[uncoveredMinTerms[i]] != true)
            return false;
    }
    return true;
}
