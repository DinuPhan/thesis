/*var groupLists = [[]];*/

//constructor function for implicants
//baseValue: number of the minterm
//bitsCovered: array of values of hamming distances of minterms covered by the implicant
//isChecked: boolean value used to determine if an implicant is already covered, initialized with false
//degree: number of bits in the base value (group number)
function implicant(baseValue, bitsCovered, isChecked, isDontCare, mintermsCovered) {
    this.baseValue = baseValue;
    this.bitsCovered = bitsCovered;
    this.isChecked = isChecked;
    this.isDontCare = isDontCare;
    this.degree = countBits(baseValue);
    this.mintermsCovered = mintermsCovered;
}

function group(degree, members) {
    this.degree = degree;
    this.members = members;
}

//generates initial implicants from minterms and dont cares
function generateImplicants() {
    var implicants = [];
    for (var i = 0; i < minTerms.length; i++) {
        implicants.push(new implicant(minTerms[i], [], false, false, [minTerms[i]]));
    }

    for (var j = 0; j < dontCares.length; j++) {
        implicants.push(new implicant(dontCares[j], [], false, true, [dontCares[j]]));
    }
    return implicants;
}

function initializeGroups() {
    //var groups = [];
    implicants = generateImplicants();

    for (var i = 0; i < implicants.length; i++) {
        groupLists[0][implicants[i].degree].members.push(implicants[i]);
    }
}

function initializeGroupList() {
    for (var i = 0; i <= numberOfInputs; i++) {
        groupLists[0].push(new group(i, []));
    }
}


//returns number of bits the binary representation of a number
function countBits(x) {
    var c = 0;
    while (x > 0) {
        if (x % 2 == 1) {
            c++;
        }
        x = Math.floor(x / 2);
    }
    return c;
}
