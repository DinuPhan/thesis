/* now we have Array groupList = [ object group of deg. = 0 , object group of deg. = 1 , .. ]
 * groupLists[0][0] --> object group = {degree: 0, members: Array of implicants}
 * groupLists[0][0].members --> [ object implicant , object implicant , .. ]
 * groupLists[0][0].members[0] --> object implicant = {baseValue: 1, bitsCovered: [], isChecked: false, isDontCare: false, degree: 1, mintermsCoverd: []}
 * in the end of this file we must have an Array of PrimeImplicants like this :
 * Array PrimeImplicants = [ object implicant , object implicant , .. ]
 * PrimeImplicants[0] = {baseValue: 2, bitsCovered: [1,2,4], isChecked: false, isDontCare: false, degree: 0}
 */

// after each groupingProcess(); we must add the unchecked implicants to this Array
/*var PrimeImplicants = [];*/

// this function generate new groupList
// we will need to put all groupLists in Array because we will need to call this function many times 
// untill the new pushed groupList to the Array be empty
function groupingProcess(currentGroupList, generatedGroupList) {
    for (var i = 0; i < currentGroupList.length - 1; i++) {
        generatedGroupList.push(grouping(currentGroupList[i].members, currentGroupList[i + 1].members, i))
    }
    for (var i = 0; i < currentGroupList.length; i++) {
        for (var j = 0; j < currentGroupList[i].members.length; j++) {
            if (!currentGroupList[i].members[j].isChecked) {
                primeImplicants.push(currentGroupList[i].members[j]);
            }
        }
    }
    return generatedGroupList;
}

// this function return new group to be added in the new groupList
function grouping(firstGroup, secondGroup, resultDegree) {
    var resultImplicants = [];
    for (var i = 0; i < firstGroup.length; i++) {
        for (var j = 0; j < secondGroup.length; j++) {
            var hamingDistance = secondGroup[j].baseValue - firstGroup[i].baseValue;
            if (groupingCondition(firstGroup[i], secondGroup[j], hamingDistance)) {
                firstGroup[i].isChecked = true;
                secondGroup[j].isChecked = true;
                var resultBitsCoverd = firstGroup[i].bitsCovered.slice();
                resultBitsCoverd.push(hamingDistance);
                var resultMintermsCovered = firstGroup[i].mintermsCovered.concat(secondGroup[j].mintermsCovered);
                var resultImplicant = new implicant(firstGroup[i].baseValue, resultBitsCoverd, false, false, resultMintermsCovered);
                if (!repeatedImpliacnt(resultImplicant, resultImplicants))
                    resultImplicants.push(new implicant(firstGroup[i].baseValue, resultBitsCoverd, false, false, resultMintermsCovered));
            }
        }
    }
    return new group(resultDegree, resultImplicants);
}


function groupingCondition(firstImplicant, secondImplicant, hamingDistance) {
    if (arraysEqual(firstImplicant.bitsCovered, secondImplicant.bitsCovered) && power_of_2(hamingDistance))
        return true;
    else
        return false;
}

function isEmptyGroupList(groupList) {
    for (var i = 0; i < groupList.length; i++) {
        if (groupList[i].members.length != 0)
            return false;
    }
    return true;
}


// helpers functions
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    a = a.sort((first, second) => first - second);
    b = b.sort((first, second) => first - second);

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// thanks to StackOverFlow :'D
function power_of_2(n) {
    return n && (n & (n - 1)) === 0;
}

function repeatedImpliacnt(imp, implicants) {
    for (var i = 0; i < implicants.length; i++) {
        if (imp.baseValue === implicants[i].baseValue && arraysEqual(imp.bitsCovered, implicants[i].bitsCovered))
            return true;
    }
    return false;
}
