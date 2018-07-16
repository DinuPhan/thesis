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

    var title = document.createElement("h3");
    title.innerHTML = "<b>Hướng dẫn từng bước<b>";
    title.setAttribute("class", "pull-center");

    var header = document.createElement("h4");
    header.innerHTML = "<b># Quá trình gom nhóm</b>";

    var guide = document.createElement("p");
    var guideText = "Trong quá trình gom nhóm, ta thực hiện các bước sau:<br>";
    guideText += "<ul>";
    guideText += "<li>B1: Liệt kê tập các <b>Minterm</b> (tế bào kích thước 1) của hàm <i>f</i> biểu diễn <b>dưới dạng nhị phân</b></li>";
    guideText += "<li>B2: Lặp lại cho đến khi không thể ghép tiếp (<i>không còn tế bào nào khác nhau chỉ 1 bit </i> ):<ul>";
    guideText += "<li>B2.1: Ghép các cặp tế bào chỉ <b>khác nhau 1 bit</b> thành phần để tạo thành các tế bào lớn hơn</li>";
    guideText += "<li>B2.2: Đánh dấu các <b>tế bào đã được dùng</b> trong quá trình ghép</li></ul></li>";
    guideText += "<li>B3: Tập các tế bào không được đánh dấu là tập <b>Prime Implicants</b> của hàm <i>f</i></li>"
    guideText += "</ul>";
    guide.innerHTML = guideText;

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
    paragraph.innerHTML = "Sau quá trình gom nhóm, ta tìm thấy các Prime Implicants sau: <b>" + primeImplicantsStringArr.join(", ") + "</b>";

    //Add jumbotron containing all group list tables
    jumbotronDiv.appendChild(title);
    jumbotronDiv.appendChild(header);
    jumbotronDiv.appendChild(guide);
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

    var header = document.createElement("h4");
    header.innerHTML = "<b># Tìm phép phủ tối tiểu</b>";

    var guide = document.createElement("p");
    var guideText = "Ta thực hiện các bước sau:<br>";
    guideText += "<ul>";
    guideText += "<li>B1: Xây dựng bảng <b>Prime Implicants</b> từ kết quả của bước gom nhóm</li>";
    guideText += "<li>B2: Xóa hết <b>các dòng bị dominated</b> và <b>các cột dominating</b>, trong đó:<ul>";
    guideText += "<li>Dòng A gọi là bị dominated bởi dòng B: khi các cột có đánh dấu X của dòng A đều bị chứa bởi dòng B</li>";
    guideText += "<li>Cột A gọi là dominating cột B: khi cột A chứa tất cả các dòng bị đánh dấu X của cột B</li></ul></li>";
    guideText += "<li>B3: Tìm các <b>essential primes</b> (nếu có) và đưa vào tập kết quả<ul>"
    guideText += "<li>Essential Primes là những dòng mà có cột chỉ chứa 1 dấu \"X\"</li></ul></li>";
    guideText += "<li>B4: Chọn các prime <b>một cách tối ưu</b> để tìm phép phủ tối tiểu (áp dụng đệ quy tìm cách chọn)</li>"
    guideText += "</ul>";
    guide.innerHTML = guideText;

    divContainer.appendChild(header)
    divContainer.appendChild(guide);

    var tableTittle = document.createElement("h4");
    var tableTittleText = document.createTextNode("Bảng Implicants/Minterms: ");
    tableTittle.appendChild(tableTittleText);
    divContainer.appendChild(tableTittle);

    var divRow = document.createElement("div");
    divRow.setAttribute("class", "row text-center");
    divRow.appendChild(generateCoverTable(primeImplicants, minTerms,findEssentialImplicants(primeImplicants,minTerms).essentialImplicants,findEssentialImplicants(primeImplicants,minTerms).uniqueMinTermsPositions));
    divContainer.appendChild(divRow);

    if (findEssentialImplicants(primeImplicants,minTerms).essentialImplicants.length > 0){
        var guideStep1 = document.createElement("p");
        var guideStep1Text = "";
        guideStep1Text = "Sau khi lập bảng, dễ dàng thấy tế bào: <b>";
        var essentialImplicantsStringArr = [];
        var essentialImplicants = findEssentialImplicants(primeImplicants,minTerms).essentialImplicants.slice();
        for (var i = 0; i < essentialImplicants.length; i++) {
            essentialImplicantsStringArr.push(generateImplicantExpression(essentialImplicants[i]));
        }
        guideStep1Text += essentialImplicantsStringArr.join(", ");
        guideStep1Text += " </b>là những essential prime implicants (những dòng mà có chứa cột chỉ có 1 dấu \"X\" như khoanh đỏ trong bảng). <br>";
        guideStep1Text += "&#8680; Ta <b>THÊM</b> các essential implicants này <b>vào kết luận</b> và lần lượt <b>LOẠI TRỪ</b> chúng cũng như các minterms của chúng ra khỏi bảng";
        guideStep1.innerHTML = guideStep1Text;
        divContainer.appendChild(guideStep1);
    }
    else {
        var guideStep1 = document.createElement("p");
        var guideStep1Text = "Sau khi lập bảng, ta <b>không tìm thấy</b> các essential primes (bắt buộc phải chọn)<br>";
        guideStep1Text += "Vì vậy, ta chọn lựa ngẫu nhiên các prime implicants cho đến khi các minterms đã được phủ kín, khi đó ta tìm được 1 phép phủ hợp lệ.<br>&#8680; Ta phải vét cạn các phép phủ khác nhau để tìm các phép phủ hợp lệ của hàm <i>f</i>  đã cho.<br>"
        guideStep1Text += "Sau khi duyệt tất cả các phép phủ, ta tìm được <b>"+ validSolutions.length + " phép phủ hợp lệ</b> (bao phủ hết các tế bào - minterms của hàm <i>f</i> ):<br>";
        for (var i = 0; i < validSolutions.length; i++){
            if (minimalSolutions.includes(validSolutions[i])){
                guideStep1Text += "<b>&nbsp;&nbsp;&nbsp;&nbsp;F("+ (i+1)+ "): " + generateSolutionExpression(validSolutions[i]);
                guideStep1Text += "</b><br>";
            }
            else{
                guideStep1Text += "&nbsp;&nbsp;&nbsp;&nbsp;F("+ (i+1)+ "): " + generateSolutionExpression(validSolutions[i]);
                guideStep1Text += "<br>";
            }            
        }
        guideStep1Text += "Dựa vào đây, ta dễ dàng tìm được các phép phủ tối tiểu của hàm <i>f</i>  gồm " + minimalSolutions.length + " công thức:<br>";
        for (var i = 0; i < minimalSolutions.length; i++){
            guideStep1Text += "&nbsp;&nbsp;&nbsp;&nbsp;F("+ (i+1)+ "): " + generateSolutionExpression(minimalSolutions[i]);
            if (i < minimalSolutions.length-1){
                guideStep1Text += "<br>";
            }
        }
        guideStep1.innerHTML = guideStep1Text;
        divContainer.appendChild(guideStep1);
    }
    console.log('eliminationRecords',eliminationRecords);

    for (var i = 0; i < eliminationRecords.length; i++){
        if (eliminationRecords[i].code == "EI"){
            if (eliminationRecords[i].uncoveredMinterms.length > 0){
                var htemp = document.createElement("h4");
                var htempText =  "Sau khi loại trừ essential implicant: "+ generateImplicantExpression(eliminationRecords[i].removedImplicant);
                var j = i+1;
                var dominatedRows = new Array();
                var dominatingColumns = new Array();
                while(eliminationRecords[j].code != "EI" && j < eliminationRecords.length){
                    if(eliminationRecords[j].code == "RD"){
                        dominatedRows.push(eliminationRecords[j].dominatedRow);
                    }
                    if(eliminationRecords[j].code == "CD"){
                        dominatingColumns.push(eliminationRecords[j].dominatingColumn);
                    }
                    j++;
                }
                if(dominatedRows.length > 0 || dominatingColumns.length > 0){
                    htempText += ", ";
                    if(dominatedRows.length > 0){
                        htempText += "dòng bị dominated : ";
                        for (let i = 0; i < dominatedRows.length; i++){
                            htempText += generateImplicantExpression(dominatedRows[i]);
                            if (i < dominatedRows.length-1){
                                htempText += ", ";
                            }
                        }
                    }
                    if (dominatingColumns.length > 0){
                        htempText += "và cột dominating: ";
                        for (let i = 0; i < dominatingColumns.length; i++){
                            htempText += dominatingColumns[i];
                            if (i < dominatingColumns.length-1){
                                htempText += ", ";
                            }
                        }
                    }
                }
                htemp.innerHTML = htempText;
                divContainer.appendChild(htemp);

                var divRow = document.createElement("div");
                divRow.setAttribute("class", "row text-center");
                var currentMove = eliminationRecords[i];
                divRow.appendChild(generateCoverTable(currentMove.remainingImplicants, currentMove.uncoveredMinterms,findEssentialImplicants(currentMove.remainingImplicants,currentMove.uncoveredMinterms).essentialImplicants,findEssentialImplicants(currentMove.remainingImplicants,currentMove.uncoveredMinterms).uniqueMinTermsPositions));
                divContainer.appendChild(divRow);
                // If there isn't anything Implicants left after the move => conclude
                if (currentMove.remainingImplicants.length == 1){
                    var conclusion = document.createElement("p");
                    var conclusionText = "Ta nhận thấy chỉ còn duy nhất 1 prime implicant, chọn implicant này và tất cả các cột (minterms) đều được phủ kín <br>&#8680; Hàm <i>f</i> có duy nhất 1 công thức đa thức tối tiểu: <b>F = ";
                    conclusionText += solutionsExpressions[0] + "</b>";
                    conclusion.innerHTML = conclusionText;
                    divContainer.appendChild(conclusion);
                }
            }
        }
    }
    containerDiv.appendChild(divContainer);
    coverTablesDiv.appendChild(containerDiv);
}

function generateCoverTable(implicants, terms, essentialImplicants, uniqueMinTermsPositions) {
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

    for (var i = 0; i < implicants.length; i++) {
        
        if (essentialImplicants.includes(implicants[i])) {
            var termsCovered = implicants[i].mintermsCovered;
            var tr = document.createElement("tr");

            var th = document.createElement("th");

            var thText = document.createTextNode(generateImplicantExpression(implicants[i]));
            th.setAttribute("class", "right-bordered");
            th.appendChild(thText);
            tr.appendChild(th);

            for (var j = 0; j < terms.length; j++) {
                var index = essentialImplicants.indexOf(implicants[i]);
                var td = document.createElement("td");
                var attributeStr = "w3-white essential-implicant"+ index;
                td.setAttribute("class", attributeStr);

                if (termsCovered.includes(terms[j])) {
                    if (uniqueMinTermsPositions[index].includes(terms[j])) {
                        var tdContainer = document.createElement("span");
                        tdContainer.setAttribute("class", "w3-badge w3-red");
                        var tdText = document.createTextNode("X");
                        tdContainer.appendChild(tdText);
                        td.appendChild(tdContainer);
                    } else {
                        var tdText = document.createTextNode("X");
                        td.appendChild(tdText);
                    }
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            // setRandomColor(i);
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

// Return the object of Essential Implicants and positions of unique minterms
function findEssentialImplicants(givenImplicants, givenMinTerms){
    var termsCoverCount = [];
    //iterate on all implicant and increment the count
    //for each min term they cover
    for (var i=0; i<givenImplicants.length; i++) {
        var primeImplicant = givenImplicants[i];
        for (var j=0; j<primeImplicant.mintermsCovered.length; j++) {
            var term = primeImplicant.mintermsCovered[j];

            //if first time to cover a term, initialize its place with 1
            if (termsCoverCount[term] == undefined) {
                termsCoverCount[term] = 1;
            } else {
                termsCoverCount[term]++;
            }
        }
    }

    var currentEssentialImplicants = new Array();
    var uniqueMinTermsPosOfAllEssentialImplicants = new Array();
    var result = {};

    // Find the essential implicants of the given remaining implicants and indexes of the unique minterms
    for (var i=0; i<givenMinTerms.length; i++) {
        if (termsCoverCount[givenMinTerms[i]] == 1) {
            for (var j=0; j<givenImplicants.length; j++) {
                var primeImplicantMinterms = givenImplicants[j].mintermsCovered;
                if (primeImplicantMinterms.includes(givenMinTerms[i])){
                    if (!currentEssentialImplicants.includes(givenImplicants[j])){
                        currentEssentialImplicants.push(givenImplicants[j]);
                    }
                }
            }
        }
    }

    for (var i = 0; i < currentEssentialImplicants.length; i++){
        var uniqueMinTermsPosOfCurrentEssentialImplicant = new Array();
        for (var j = 0; j < currentEssentialImplicants[i].mintermsCovered.length; j++){
            var currentMinTerm = currentEssentialImplicants[i].mintermsCovered[j];
            if (termsCoverCount[currentMinTerm] == 1){
                uniqueMinTermsPosOfCurrentEssentialImplicant.push(currentMinTerm);
            }
        }
        uniqueMinTermsPosOfAllEssentialImplicants.push(uniqueMinTermsPosOfCurrentEssentialImplicant.slice());
    }
    return {essentialImplicants: currentEssentialImplicants, uniqueMinTermsPositions: uniqueMinTermsPosOfAllEssentialImplicants};
}

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }



// function setRandomColor(i){
//     var attributeStr = ".essential-implicant" + i;
//     console.log('attributeStr',document.getElementsByClassName(attributeStr));
//     // document.getElementsByClassName(attributeStr).style.backgroundColor = getRandomColor();
//     $(attributeStr).css("background-color",getRandomColor());
// }