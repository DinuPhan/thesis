/* now we have Array PrimeImplicants = [ object implicant , object implicant , .. ]
 * PrimeImplicants[0] --> object implicant = {baseValue: 1, bitsCovered: [2,4], isChecked: false, 
 *                                            isDontCare: false, degree: 1, mintermsCoverd: [1,3,5,7]}
 * in the end of this file we must have an Array of RemaningPI like this :
 * Array RemaningPI = [ object implicant , object implicant , .. ]
 * RemaningPI[0] = {baseValue: 1, bitsCovered: [2,4], isChecked: false, isDontCare: false, degree: 0, mintermsCoverd: [1,3]}
 */

var remainingImplicants;
var uncoveredMinTerms;

function eliminationProcess() {
	//duplicate primeImplicants array into remainingImplicants
	remainingImplicants = primeImplicants.slice();
	uncoveredMinTerms = minTerms.slice();
	while (uncoveredMinTerms.length>0 && (checkEssentialImplicants() || checkRowDominance() || checkColumnDominance()));
}

function checkEssentialImplicants() {
	//sparse array to store how many implicants
	//each minterm is covered by
	//the value for minterms not included will be undefined
	var termsCoverCount = [];

	var essentialImplicantFound = false;

	//iterate on all implicant and increment the count
	//for each min term they cover
	for (var i=0; i<remainingImplicants.length; i++) {
		var primeImplicant = remainingImplicants[i];

		for (var j=0; j<primeImplicant.mintermsCovered.length; j++) {
			var term = primeImplicant.mintermsCovered[j]

			//if first time to cover a term, initialize its place with 1
			if (termsCoverCount[term] == undefined) {
				termsCoverCount[term] = 1;
			} else {
				termsCoverCount[term]++;
			}
		}
	}

	for (var i=0; i<uncoveredMinTerms.length; i++) {

		//if a term is only covered by one implicant,
		//find the implicant and add it to resultImplicants
		if (termsCoverCount[uncoveredMinTerms[i]] == 1) {
			for (var j=0; j<remainingImplicants.length; j++) {

				var primeImplicantMinterms = remainingImplicants[j].mintermsCovered;

				if (primeImplicantMinterms.includes(uncoveredMinTerms[i])) {

					//remove all minterms this implicant covers
					for (var k=0; k<primeImplicantMinterms.length; k++) {
						if (uncoveredMinTerms.includes(primeImplicantMinterms[k])) {
							var termIndex = uncoveredMinTerms.indexOf(primeImplicantMinterms[k]);
							uncoveredMinTerms.splice(termIndex,1)
						}
					}

					//add implicant to resultImplicants and remove it from remainingImplicants
					resultImplicants.push(remainingImplicants[j]);
					remainingImplicants.splice(j,1);
					essentialImplicantFound = true;
					break;
				}

			}
		}
	}

	return essentialImplicantFound;
}

//compares every two rows to check for row dominance
function checkRowDominance() {
	//var rowDominanceFound = false;

	for (var i=0; i<remainingImplicants.length; i++) {
		for (var j=0; j<remainingImplicants.length; j++) {
			if (i==j) continue;

			//if dominance found, remove the dominated row
			if (rowDominates(remainingImplicants[i], remainingImplicants[j])) {
				remainingImplicants.splice(j,1);
				return true;
				//rowDominanceFound = true;
			}

		}
	}
	return false;
	//return rowDominanceFound;
}

//checks if the first implicant row-dominates the second implicant
function rowDominates(imp1, imp2) {
	//counters to check if both implicants cover the same minterms
	var termsCount1 = 0;
	var termsCount2 = 0;

	for (var i=0; i<imp2.mintermsCovered.length; i++) {

		var termInImp2 = imp2.mintermsCovered[i];

		if (uncoveredMinTerms.includes(termInImp2)) {
			if (!imp1.mintermsCovered.includes(termInImp2)) {
				return false;
			} else {
				termsCount2++;
			}
		}
	}

	for (var i=0; i<imp1.mintermsCovered.length; i++) {
		var termInImp1 = imp1.mintermsCovered[i];
		if (uncoveredMinTerms.includes(termInImp1)) {
			termsCount1++;
		}
	}

	if (termsCount1 == termsCount2) {
		return false;
	}
	return true;
}

//compares every two columns to check for column dominance
function checkColumnDominance() {
	//var columnDominanceFound = false;

	for (var i=0; i<uncoveredMinTerms.length; i++) {
		for (var j=0; j<uncoveredMinTerms.length; j++) {
			if (i==j) continue;

			//if dominance found, remove the dominated column
			if (columnDominates(uncoveredMinTerms[i], uncoveredMinTerms[j])) {
				uncoveredMinTerms.splice(j,1);
				return true;
				//columnDominanceFound = true;
			}
		}
	}
	return false;
	//return columnDominanceFound;
}

//checks if the first minterm column-dominates the second minterm
function columnDominates(term1, term2) {
	for (var i=0; i<remainingImplicants.length; i++) {
		var currentImplicantTerms = remainingImplicants[i].mintermsCovered;

		if (currentImplicantTerms.includes(term1) && !currentImplicantTerms.includes(term2)) {
			return false;
		}
	}
	return true;
}