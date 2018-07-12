/*var groupLists = [[]];*/

//constructor function for implicants
//baseValue: number of the minterm
//bitsCovered: array of values of hamming distances of minterms covered by the implicant
//bitsRepresentation: string of binary representation of the implicant given the bitsCovered
//isChecked: boolean value used to determine if an implicant is already covered, initialized with false
//degree: number of bits in the base value (group number)
function implicant(baseValue, bitsCovered, isChecked, isDontCare, mintermsCovered) {
    this.baseValue = baseValue;
    this.bitsCovered = bitsCovered;
    // this.bitsRepresentation = bitsRepresentation.substring(0);
    this.bitsRepresentation = generateBinaryString(baseValue,bitsCovered);
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
        // var binaryStr =  generateBinaryString(minTerms[i],[]);
        implicants.push(new implicant(minTerms[i], [],false, false, [minTerms[i]]));
    }

    for (var j = 0; j < dontCares.length; j++) {
        // var binaryStr =  generateBinaryString(minTerms[j],[]);
        implicants.push(new implicant(dontCares[j], [],false, true, [dontCares[j]]));
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

//returns a string of binary representation of an implicant given the bitsCovered
function generateBinaryString(x,bitsCovered){
    var res = "";
    res = x.toString(2);
    while(res.length < 4){
        res = "0" + res;
    }
    if (bitsCovered.length > 0){
        for (var i = 0; i < bitsCovered.length; i++){
            // find the replace pos from the bottom of the string
            // if bit change at 4 (bitsCovered[i] == 4) => pos to replace = 4 - 1 - log2(4) = 1
            var pos = (res.length -1) - Math.log2(bitsCovered[i]);
            res = res.substring(0,pos) + "-" + res.substring(pos+1);
        }
    }
    return res;    
}


//compare equality of two implicants arr
function isEqualImplicants(impArr1, impArr2){
    for (var i = 0; i < impArr1.length; i++){
        if(!impArr2.includes(impArr1[i])){
            return false;
        }
    }
    for (var i = 0; i < impArr2.length; i++){
        if(!impArr1.includes(impArr2[i])){
            return false;
        }
    }
    return true;
}