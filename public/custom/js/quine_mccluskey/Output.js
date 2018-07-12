//creates an HTML element to display output

var output;
var solutionsExpressions;

function printOutput() {
    var jumbotronDiv = document.createElement("div");
    jumbotronDiv.setAttribute("class", "sixteen columns well header-color add-bottom")

    var para = document.createElement("p");
    var paragraphText = document.createTextNode("Bạn đã nhập: " + minTerms + " minterms => tương đương với: " + numberOfInputs + " biến đầu vào");
    para.appendChild(paragraphText);
    jumbotronDiv.append(para);
    if (!specialcase) {
        solutionsExpressions = generateSolutionsExpressions();
    }
    output = "";
    for (var i = 0; i < solutionsExpressions.length; i++) {
        var solutionParagraph = document.createElement("p");
        var solutionText = document.createTextNode("Kết quả " + (i + 1) + ": F = " + solutionsExpressions[i]);
        output = output.concat("Kết quả " + (i + 1) + ": F = " + solutionsExpressions[i] + "\n");
        solutionParagraph.appendChild(solutionText);
        jumbotronDiv.append(solutionParagraph);
    }

    var outputDiv = document.getElementById("output");

    //removes content of the output div in case the user enters another input without refreshing
    while (outputDiv.hasChildNodes()) {
        outputDiv.removeChild(outputDiv.lastChild);
    }

    outputDiv.appendChild(jumbotronDiv);
}


function printSteps() {

    if (!specialcase) {
        generateGroupListsTables();
    }

    console.log('uncoveredMinTerms',uncoveredMinTerms,uncoveredMinTerms != undefined );
    if (uncoveredMinTerms != undefined) {
        generateCoverTables();
    }

}

function clearSteps() {
    var groupingDiv = document.getElementById("grouping");
    var coverTablesDiv = document.getElementById("coverTables");

    //removes content of the output div in case the user enters another input without refreshing
    while (groupingDiv.hasChildNodes()) {
        groupingDiv.removeChild(groupingDiv.lastChild);
    }

    while (coverTablesDiv.hasChildNodes()) {
        coverTablesDiv.removeChild(coverTablesDiv.lastChild);
    }
}
//-------------------------------------Grouping Process Functions--------------------
/*
 * Creates tables out
 * of the group lists
 */
function generateGroupListsTables() {
    var divContainer = document.createElement("div");
    divContainer.setAttribute("class", "fluid container add-bottom")

    var jumbotronDiv = document.createElement("div");
    jumbotronDiv.setAttribute("class", "sixteen columns well header-color add-bottom");

    var header = document.createElement("h3");
    var headerText = document.createTextNode("Quá trình gom nhóm");
    header.appendChild(headerText);

    var guide = document.createElement("p");
    var guideText = document.createTextNode("");
    guide.appendChild(guideText);

    for (var i = 0; i < groupLists.length; i++) {
        groupListTable = generateGroupListTable(groupLists[i], i);
        divContainer.appendChild(groupListTable);
    }

    var groupingDiv = document.getElementById("grouping");

    var primeImplicantsStringArr = [];
    for (var i = 0; i < primeImplicants.length; i++) {
        primeImplicantsStringArr.push(generateImplicantExpression(primeImplicants[i]));
    }
    var paragraph = document.createElement("p");
    var paragraphText = document.createTextNode("Các Prime Implicants tìm thấy: " + primeImplicantsStringArr.join(", "))
    paragraph.appendChild(paragraphText);

    //Add jumbotron containing all group list tables
    jumbotronDiv.appendChild(header);
    jumbotronDiv.appendChild(divContainer);
    jumbotronDiv.appendChild(paragraph);
    groupingDiv.appendChild(jumbotronDiv);
}

/*
 * Creates one table out
 * of a group list
 * returns a div containing the table
 */
function generateGroupListTable(groupList, index) {


    var divCol4 = document.createElement("div");
    divCol4.setAttribute("class", "col-xs-6 col-sm-6 col-md-3 col-lg-3");

    var divTableResponsive = document.createElement("div");
    divTableResponsive.setAttribute("class", "table-responsive");

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered");

    var thead = document.createElement("thead");
    var tr1 = document.createElement("tr");
    var th = document.createElement("th");
    th.setAttribute("colspan", 3);
    th.setAttribute("class","success");
    thText = document.createTextNode("Tế bào kích thước " + Math.pow(2, index));
    th.appendChild(thText);

    tr1.appendChild(th);
    thead.appendChild(tr1);
    table.appendChild(thead);


    var tbody = generateGroupListTableBody(groupList);

    table.appendChild(tbody);
    divTableResponsive.appendChild(table);
    divCol4.appendChild(divTableResponsive);
    return divCol4;
}

/*
 * Creates table body and
 * populates it with data of the implicant
 * returns a populated table bodyl
 */
function generateGroupListTableBody(groupList) {
    var tbody = document.createElement("tbody");

    for (var i = 0; i < groupList.length; i++) {
        var group = groupList[i];

        for (var j = 0; j < group.members.length; j++) {
            imp = group.members[j];

            var tr = document.createElement("tr");
            if (j == 0) {
                tr.setAttribute("class", "top-bordered")
            }

            var td1 = document.createElement("td");
            td1Text = document.createTextNode(imp.mintermsCovered.join(", "));
            td1.appendChild(td1Text);

            var td2 = document.createElement("td");
            td2Text = document.createTextNode(imp.bitsRepresentation);
            td2.appendChild(td2Text);

            var td3 = document.createElement("td");
            var symbol;
            if (imp.isChecked) {
                symbol = "✓";
            } else {
                symbol = "Prime";
            }

            if (imp.isDontCare) {
                symbol = symbol + " Dont care";
            }
            td2Text = document.createTextNode(symbol);
            td3.appendChild(td2Text);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tbody.appendChild(tr);
        }
    }
    return tbody;
}

//-------------------------------------Minterms Implicants tables functions--------------------

function generateCoverTables() {
    var coverTablesDiv = document.getElementById("coverTables");
    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("class", "fluid container");
    var divContainer = document.createElement("div");
    divContainer.setAttribute("class", "sixteen columns well header-color add-bottom");

    var h3 = document.createElement("h3");
    var h3Text = document.createTextNode("Bảng Implicants/Minterms: ");
    h3.appendChild(h3Text);
    divContainer.appendChild(h3);

    var divRow = document.createElement("div");
    divRow.setAttribute("class", "row text-center");
    divRow.appendChild(generateCoverTable(primeImplicants, minTerms,essentialImplicants));
    divContainer.appendChild(divRow);

    // if (eliminationRecords[i].uncoveredMinterms.length > 0) {
    //      var htemp = document.createElement("h3");
    //      console.log('eliminationRecords[i]', eliminationRecords[i]);
    //      var htempText = document.createTextNode("Sau khi loại trừ essential implicant: " + generateImplicantExpression(eliminationRecords[i].removedImplicants));
    //      htemp.appendChild(htempText);
    //      divContainer.appendChild(htemp);

    //      var divRow = document.createElement("div");
    //      divRow.setAttribute("class", "row text-center");
    //      divRow.appendChild(generateCoverTable(eliminationRecords[i].remainingImplicants, eliminationRecords[i].uncoveredMinterms,essentialImplicants));
    //      divContainer.appendChild(divRow);
    //  }

    // for (var i = 0; i < eliminationRecords.length; i++){
    //     if (eliminationRecords[i].code == "EI"){
    //         if (eliminationRecords[i].uncoveredMinterms.length > 0){
    //             var htemp = document.createElement("h3");
    //             console.log('eliminationRecords[i]',eliminationRecords[i]);
    //             var htempText =  document.createTextNode("Sau khi loại trừ essential implicant: "+ generateImplicantExpression(eliminationRecords[i].removedImplicants));
    //             htemp.appendChild(htempText);
    //             divContainer.appendChild(htemp);

    //             var divRow = document.createElement("div");
    //             divRow.setAttribute("class", "row text-center");
    //             divRow.appendChild(generateCoverTable(eliminationRecords[i].remainingImplicants, eliminationRecords[i].uncoveredMinterms));
    //             divContainer.appendChild(divRow);
    //         }
    //     }
    //     else if (eliminationRecords[i].code == "RD"){
    //         if (eliminationRecords[i].uncoveredMinterms.length > 0){
    //             var htemp = document.createElement("h3");
    //             console.log('eliminationRecords[i]',eliminationRecords[i]);
    //             var htempText =  document.createTextNode("Sau khi loại trừ dominated row: "+ generateImplicantExpression(eliminationRecords[i].dominatedRow));
    //             htemp.appendChild(htempText);
    //             divContainer.appendChild(htemp);

    //             var divRow = document.createElement("div");
    //             divRow.setAttribute("class", "row text-center");
    //             divRow.appendChild(generateCoverTable(eliminationRecords[i].remainingImplicants, eliminationRecords[i].uncoveredMinterms));
    //             divContainer.appendChild(divRow);
    //         }
    //     }
    //     else if (eliminationRecords[i].code == "CD"){
    //         if (eliminationRecords[i].uncoveredMinterms.length > 0){
    //             var htemp = document.createElement("h3");
    //             console.log('eliminationRecords[i]',eliminationRecords[i]);
    //             var htempText =  document.createTextNode("Sau khi loại trừ dominated column: "+ eliminationRecords[i].dominatedColumn);
    //             htemp.appendChild(htempText);
    //             divContainer.appendChild(htemp);

    //             var divRow = document.createElement("div");
    //             divRow.setAttribute("class", "row text-center");
    //             divRow.appendChild(generateCoverTable(eliminationRecords[i].remainingImplicants, eliminationRecords[i].uncoveredMinterms));
    //             divContainer.appendChild(divRow);
    //         }
    //     }
    // }
    containerDiv.appendChild(divContainer);
    coverTablesDiv.appendChild(containerDiv);
}

function generateCoverTable(implicants, terms, essentialImplicants) {
    var divTableResponsive = document.createElement("div");
    divTableResponsive.setAttribute("class", "table-responsive");

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered");

    var thead = document.createElement("thead");
    var tr1 = document.createElement("tr");
    tr1.setAttribute("class", "bottom-bordered");

    var th1 = document.createElement("th");
    th1.setAttribute("class", "bottom-bordered");
    tr1.appendChild(th1);

    for (var i = 0; i < terms.length; i++) {
        var th = document.createElement("th");
        var thText = document.createTextNode(terms[i]);
        th.setAttribute("class", "success right-bordered");
        th.appendChild(thText);
        tr1.appendChild(th);
    }
    thead.appendChild(tr1);

    var tbody = document.createElement("tbody");

    console.log('essentialImplicants',essentialImplicants);
    for (var i = 0; i < implicants.length; i++) {
        if(essentialImplicants.includes(implicants[i])){
            var termsCovered = implicants[i].mintermsCovered;
            var tr = document.createElement("tr");

            var th = document.createElement("th");

            var thText = document.createTextNode(generateImplicantExpression(implicants[i]));
            th.setAttribute("class", "right-bordered");
            th.appendChild(thText);
            tr.appendChild(th);

            for (var j = 0; j < terms.length; j++) {
                var td = document.createElement("td");
                td.setAttribute("class","essential-implicant w3-white");
                var index = essentialImplicants.indexOf(implicants[i]);
                if (termsCovered.includes(terms[j])){
                    var currentCoveredTermIndex = termsCovered.indexOf(terms[j]);
                    if (currentCoveredTermIndex == uniqueMinTermsPositions[index]){
                        var tdContainer = document.createElement("span");
                        tdContainer.setAttribute("class","w3-badge w3-red");
                        var tdText = document.createTextNode("X");
                        tdContainer.appendChild(tdText);
                        td.appendChild(tdContainer);
                    }
                    else{
                        var tdText = document.createTextNode("X");
                        td.appendChild(tdText);
                    }
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        else{
            var termsCovered = implicants[i].mintermsCovered;
            var tr = document.createElement("tr");

            var th = document.createElement("th");

            var thText = document.createTextNode(generateImplicantExpression(implicants[i]));
            th.setAttribute("class", "right-bordered");
            th.appendChild(thText);
            tr.appendChild(th);

            for (var j = 0; j < terms.length; j++) {
                var td = document.createElement("td");
                if (termsCovered.includes(terms[j])) {
                    var tdText = document.createTextNode("X");
                    td.appendChild(tdText);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        // var termsCovered = implicants[i].mintermsCovered;
        // var tr = document.createElement("tr");

        // var th = document.createElement("th");

        // var thText = document.createTextNode(generateImplicantExpression(implicants[i]));
        // th.setAttribute("class", "right-bordered");
        // th.appendChild(thText);
        // tr.appendChild(th);

        // for (var j = 0; j < terms.length; j++) {
        //     var td = document.createElement("td");
        //     if (termsCovered.includes(terms[j])) {
        //         var tdText = document.createTextNode("X");
        //         td.appendChild(tdText);
        //     }
        //     tr.appendChild(td);
        // }
        // tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    divTableResponsive.appendChild(table);
    return divTableResponsive;
}
//-------------------------------------Implicants to literals functions--------------------

//takes an array of all the valid solutions
//returns an array of strings each an expression for a solution
function generateSolutionsExpressions() {
    solutionsExpressions = [];
    for (var i = 0; i < solutions.length; i++) {
        solutionsExpressions.push(generateSolutionExpression(solutions[i]))
    }
    return solutionsExpressions;
}

/*takes an array of implicants representing a valid solution
 *returns a string representing the expression of these implicants in literals
 */
function generateSolutionExpression(solution) {
    var expression = [];
    for (var i = 0; i < solution.length; i++) {
        expression.push(generateImplicantExpression(solution[i]))
    }
    return expression.join(" + ");
}

/*takes one implicant
 *and returns it in form of literals
 */
function generateImplicantExpression(imp) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charArr = [];
    var baseValue = imp.baseValue;
    var bitsCovered = imp.bitsCovered;

    for (var i = 0; i < numberOfInputs; i++) {
        charArr.push("0");
    }

    for (var i = 0; i < numberOfInputs; i++) {
        if (baseValue & 1 << i) {
            var flippedIndex = numberOfInputs - 1 - i;
            charArr[flippedIndex] = "1";
        }
    }

    for (var i = 0; i < bitsCovered.length; i++) {
        var index = Math.log2(bitsCovered[i]);
        var flippedIndex = numberOfInputs - 1 - index;
        charArr[flippedIndex] = "x";
    }

    for (var i = 0; i < charArr.length; i++) {
        if (charArr[i] == "0") {
            charArr[i] = alphabet[i].concat("'");
        } else if (charArr[i] == "1") {
            charArr[i] = alphabet[i];
        } else if (charArr[i] == "x") {
            charArr[i] = "";
        }
    }

    return charArr.join('');
}


//compare equality of two implicants arr
function isArraysEqual(impArr1, impArr2){
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