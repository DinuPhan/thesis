// Constants
var MaxVariableCount = 4;							
var VariableNames = new Array("X","Y","Z","T");	// names of the variables
var Width  = new Array(0,2,2,4,4);				// width of Kmap for each VariableCount
var Height = new Array(0,2,2,2,4);				// height of Kmap for each VariableCount
var BitOrder = new Array(2,3,1,0);				// bits across and down Kmap
var BackgroundColor="white";
var AllowDontCare=false;						// true doesn't guarantee a minimal solution
var DontCare = "X";

// Variables (initialized here)
var VariableCount=4;							//1..4
var TruthTable = new Array();					// truth table structure[row][variable]
var KMap = new Array();							// KMap[across][down]
var SolEquation = new Array();					// solution results (minimized equation) 
var FunctionText = "";							// F(ABC)= 
var EquationHighlightColor = "rgb(243,194,86)";
var Heavy = 20;

//Global variable for step by step explanation
var LargeRects = new Array();					// Large rects (size of 4 and 2) found in step 1
var Step2Rects = new Array();					// Rects that cover 1-weight cells in step 2
var flagStep3 = false;							// Flag to see if the rects in step 2 coverted all the Kmap or not
												// Flag == false => Step 4, Flag == true => Go to Step 3
var LeftoverCells = new Array();
var Step4Equations = new Array();				// Expressions of S.O.P in Step4


for (i=0; i<Math.pow(2,MaxVariableCount); i++)
{
	SolEquation[i] = new Array();				// for each term in result function
	SolEquation[i].ButtonUIName = "EQ" + i;		// used to generate HTML IDs
	SolEquation[i].Expression = "";				// HTML text for term 
	SolEquation[i].Rect = null;					// 'rect' for term 
	SolEquation.NumOfTerms=0;					// # of terms in current result function
}

SolEquation.NumOfTerms=1;
SolEquation[0].Expression="0";


// initialize the truth table and kmap structure for the given number of variables
function InitializeTables(VarCount)
{
	TruthTable = new Array();
	KMap = new Array();							

	VariableCount = VarCount;
	KMap.Width=Width[VariableCount];
	KMap.Height=Height[VariableCount];

	for (i=0; i<Math.pow(2,VariableCount); i++)
	{
		TruthTable[i] = new Array();
		TruthTable[i].Index = i;
		TruthTable[i].Name = i.toString(2);
		TruthTable[i].ButtonUIName = "TT"+TruthTable[i].Name;
		TruthTable[i].TTROWUIName = "TTROW" + TruthTable[i].Name;
		for (j=0; j<Math.pow(2,VariableCount); j++)
		{
			TruthTable[i][j] = new Array();
			TruthTable[i][j].Variable = (i & (1<<(VariableCount-(1+j)))?1:0)?true:false;
			TruthTable[i][j].Name = VariableNames[j];
			TruthTable[i][j].KMapEntry = null;
		}
	}
	KMap.XVariables = KMap.Width/2;
	KMap.YVariables = KMap.Height/2;

	for (w=0; w<KMap.Width; w++)
	{
		KMap[w]=new Array();
		for (h=0; h<KMap.Height; h++)
		{
			KMap[w][h]=new Array();
			KMap[w][h].Value = false;
			if (VariableCount == 2){
				mapstr = BinaryString(BitOrder[w+2],KMap.XVariables) + BinaryString(BitOrder[h+2],KMap.YVariables);
			}
			else if(VariableCount == 3)
				mapstr = BinaryString(BitOrder[w],KMap.XVariables) + BinaryString(BitOrder[h+2],KMap.YVariables);
			else 
				mapstr = BinaryString(BitOrder[w],KMap.XVariables) + BinaryString(BitOrder[h],KMap.YVariables);
			mapval = parseInt(mapstr,2);
			KMap[w][h].TruthTableEntry = TruthTable[mapval];
			KMap[w][h].TruthTableEntry.KMapEntry = KMap[w][h];
			KMap[w][h].ButtonUIName = "KM" + KMap[w][h].TruthTableEntry.Name;
			KMap[w][h].TDUIName = "TD" + KMap[w][h].TruthTableEntry.Name;
			KMap[w][h].Covered = false;
			KMap[w][h].Variable = new Array();
			for (i=0; i<VariableCount; i++)
			{
				KMap[w][h].Variable[i] = KMap[w][h].TruthTableEntry[i].Variable;
			}
		}
	}

	FunctionText = "ƒ(";
	for (i=0; i<VariableCount; i++)
	{
		FunctionText += VariableNames[i];
	}
	FunctionText+=")";
}

InitializeTables(VariableCount);

// returns a color to use for the backround for a given boolean value 
//    Value is expected to be "1", "0", or "X"
function HighlightColor( Value )
{
	if (Value=="1") return "rgb(200,90,60)";    //0x00FF00;
	if (Value=="0") return "rgb(0,195,151)"; //~0xFF0000;
	return "gray"; //0x7F7F7F;
}

// returns a color to use for rollover highlighting 
//    Value is expected to be "1", "0", or "X"
function RectHighlightColor( Value )
{
	return EquationHighlightColor;
}

// init code (setup display according to query parameters)
function Load()
{
	if (PageParameter("Variables")=="3")
	{
		ChangeVariableNumber( 3 );
	}
	else if (PageParameter("Variables")=="2")
	{
		ChangeVariableNumber( 2 );
	}
	else if (PageParameter("Variables")=="4")
	{
		ChangeVariableNumber( 4 );
	}
	else 
	{
		ChangeVariableNumber( VariableCount );
	}
	if (PageParameter("DontCare")=="true")
	{
		ToggleDontCare();
	}

	//Hide the stepbystep explanation at first
	$("#StepByStep").hide();
	$("#Step_3").hide();
}

window.onload = Load;

// constructs a Rect type
function CreateRect( x,y,w,h )
{
	var Obj=new Array();
	Obj.x = x;
	Obj.y = y;
	Obj.w = w;
	Obj.h = h;
	return Obj;
}

// Comparison of two trinary 'boolean' values (a boolean value or don't care)
function Compare( Value1, Value2 )
{
	if ( (Value1 == Value2) || (Value1==DontCare) || (Value2==DontCare) )
	{
		return true;
	}
	else
	{
		return false;
	}
}

// determines if a Rect with a given value fits on the KMap: it 'fits' if every square of the Rect
// matches (copmares with) the TestValue.
// Assumes top left of Rect is within the KMap.
// Assumes Rect is not larger than KMap
function TestRect( Rect, TestValue )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			var Test = KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Value;
			if (!Compare(TestValue,Test))
			{
				return false;
			}
		}
	}
	return true;
}

// Returns true if for every square of the Rect in the KMap, the .Covered flag is set
//    or the value of the square is don't care.
function IsCovered( Rect )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			if (!KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Covered) 
			{
				//treat dont care's as already covered
				if (!(KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Value==DontCare))
				{
					return false;
				}
			}
		}
	}
	return true;
}

// Sets the .Covered flag for every square of the Rect in the KMap
function Cover( Rect, IsCovered )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Covered = IsCovered;
		}
	}
}

// Tries every x,y location in the KMap to see if the given rect size (w,h) will fit there
//   (matches in value).  For each location that fits, creates a rect and adds it to the Found 
//   array.  If DoCover is true, also sets the KMap .Cover flag for the rects that fit.
function SearchRect( w,h, TestValue, Found, DoCover )
{
	if ((w>KMap.Width) || (h>KMap.Height))
	{
		return;  // rect is too large
	}
		
	var x=0;
	var y=0;
	var across = (KMap.Width==w) ?1:KMap.Width;
	var down   = (KMap.Height==h)?1:KMap.Height;
	for (x=0; x<across; x++)
	{
		for (y=0; y<down; y++)
		{
			var Rect = CreateRect(x,y,w,h);
			// 
			if (TestRect(Rect,TestValue))
			{
				if (!IsCovered(Rect))
				{
					//append the yet to be Covered Rect to Found
					Found[Found.length]=Rect;
					if (DoCover) Cover(Rect, true);
				}
			}
		}
	}
}

// Iterates through an array of Rects (in order) to determine which of them
//  cover something in the KMap and which don't (because previous ones already
//  have covered enough).  Adds rects that do cover something to the Used array.
function TryRects(Rects,Used)
{
    var j = 0;
    for (j = 0; j < Rects.length; j++)
    {
        var Rect = Rects[j];
        if (TestRect(Rect, true))
        {
            if (!IsCovered(Rect))
            {
                Used[Used.length] = Rect;
                Cover(Rect, true);
            }
        }
    }
}

// Adds the given Weight to every element of the Weights map that corresponds to the Rect.
function AddRectWeight(Weights, Rect, Weight)
{
    var dx = 0;
    var dy = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            Weights[(Rect.x + dx) % KMap.Width][(Rect.y + dy) % KMap.Height] += Weight;
        }
    }
}

// Retrieves a weight value of a rect, by summing the weight of each square in the Weights
// map that correspond to the Rect
function GetRectWeight(Weights, Rect)
{
    var dx = 0;
    var dy = 0;
    var W = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            W += Weights[(Rect.x + dx) % KMap.Width][(Rect.y + dy) % KMap.Height];
        }
    }
    return W;
}


// Used for the array sorting function to sort objects by each object's .Weight member 
function SortByWeight(a, b)
{
    if (a.Weight < b.Weight) return -1;
    else if (a.Weight > b.Weight) return 1;
    else return 0;
}

// Returns true if two Rects overlap (share any squares)
function OverlappingRects(R1,R2)
{
    if ( (R1.x+R1.w>R2.x) && 
         ((R2.x+R2.w)>(R1.x)) &&
         (R1.y+R1.h>R2.y) && 
         ((R2.y+R2.h)>(R1.y))
        )
        return true;
    return false;
}

// Sorts a list of Rects that cover squares of the KMap, and returns a minimal
// subset of those Rects that cover the same squares
function FindBestCoverage(Rects2x1,AllRects)
{
    // Initilize a new 'Weight' map
    var Weights = new Array();
    for (w = 0; w < KMap.Width; w++)
    {
        Weights[w] = new Array();
        for (h = 0; h < KMap.Height; h++)
        {
        	// Weights[w][h] = (KMap[w][h].Covered)?Heavy:0;
           	Weights[w][h] = 0;
        }
    }
    
    
    // seed the weight map with 1 for every square covered by every Rect (all the large rects)
    var i = 0;
    for (i = 0; i < LargeRects.length; i++)
    {
        AddRectWeight(Weights, LargeRects[i], 1);
    }

    // // console.log('Current Weight',Weights);

    // // generate a set of rects sorted by weight - but  after selecting each minimal
    // // weighted rect, re-weight the map for the next selection.  Re-weight by
    // // making the squares of the selected Rect very heavy, but reduce the
    // // weight of any squares for Rects that overlap the selected Rect.  This has the
    // // effect of pushing the rects that duplicate KMap coverage to the back of the list, 
    // // while bubbling non-overlapping maximal covering rects to the front.
    // var SortedRects = new Array();
    // while (Rects2x1.length>0)
    // {
    //     var j=0;
    //     for (j = 0; j < Rects2x1.length; j++)
    //     {   // get the weight for the remaining Rects
    //         Rects2x1[j].Weight = GetRectWeight(Weights, Rects2x1[j]);
    //     }
    //     // Sort the array to find a Rect with minimal weight
    //     Rects2x1.sort(SortByWeight);
    //     SortedRects.push(Rects2x1[0]);
    //     if (Rects2x1.length == 1)
    //     {   // just found the last Rect, break out
    //         break;
    //     }
    //     // Make the weight map very heavy for the selected Rect's squares
    //     AddRectWeight(Weights, Rects2x1[0], Heavy);
    //     // Reduce the weight for Rects that overlap the selected Rect
    //     for (j=0; j< Rects2x1.length; j++)
    //     {
    //         if (OverlappingRects(Rects2x1[0], Rects2x1[j]))
    //         {
    //             AddRectWeight(Weights, Rects2x1[j], -1);
    //         }
    //     }
    //     // continue processing with all the Rects but the first one
    //     Rects2x1 = Rects2x1.slice(1);
    // }
    
    // // determine which of the sorted array of Rects are actually needed
    // TryRects(SortedRects, AllRects);


    // Step 2 - Find the minimalRects that cover the 1-weight cells (1-weight cells are the cells that belong only to 1 Rect)
    var dx = 0
    var dy = 0
    var step2_tempRects = new Array();

    for (dx = 0; dx <  Weights.length; dx++){
    	for(dy = 0; dy < Weights[0].length; dy++){
    		// If found the 1-weight cell, choose the Large Rect that covers it and then seed it to make it large (avoid duplicate LargeRect)
    		if (Weights[dx][dy] == 1){
    			// Save both the minimal Rects and its position of 1-weight cell
    			// Because it's 1-weight cell (which only have 1 Rect that cover it) so we just need the first of rectsCoveringCellAt(dx,dy)
    			step2_tempRects.push({Rect: rectsCoveringCellAt(dx,dy)[0], Pos: {x: dy+1, y: dx+1} });
    			AddRectWeight(Weights, rectsCoveringCellAt(dx,dy)[0], 100);
    		}
    	}
    }
    Step2Rects = step2_tempRects.slice(0); //clone from step2_tempRects to global scope Step2Rects

    //Step 3 - if the minimal Rects found in Step 2 cannot covered the KMap, pick randomly an uncovered cell to continue with Step 3
    //if the Kmap is Convered, jump to Step 4
    if (isKMapCoveredBy(Weights,Step2Rects) == false){
    	flagStep3 = true;

    	LeftoverCells = findLeftoverCells(Weights);
    	//Every leftover cell will store:
		// 1) the position (.Pos)
		// 2) Rects that is covering the leftover cell (more than 2 because leftover cells are not 1-weight cell) (.Rects)
    	var Step3_Combinations = determinePossibleCombs(LeftoverCells);
    	// Add the Step2_Rects to Step3 combination
    	for (var i = 0; i < Step3_Combinations.length; i++){
    		for (var j = 0; j < Step2Rects.length; j++){
    			Step3_Combinations[i].unshift(Step2Rects[j].Rect);
    		}
    	}
    	if(!isKMapCovereByCurrentCombination(Step3_Combinations)){
			for (var i = 0; i < Step3_Combinations.length; i++){
	    		addSoleRects1x1(Step3_Combinations[i]);
	    	}
    	}
    	return Step3_Combinations;
    }
    else {
    	//Step2Rects has already fully covered the KMap => return only 1 combination that have Step2Rects
    	flagStep3 = false;
    	var Step2_Combination = new Array();
    	var Combination = new Array();
    	for (var i = 0; i < Step2Rects.length; i++){
    		Combination.push(Step2Rects[i].Rect);
    	}
    	Step2_Combination.push(Combination);
    	if(!isKMapCovereByCurrentCombination(Step2_Combination)){
    		addSoleRects1x1(Step2_Combination);
    	}
    	return Step2_Combination;
    }
}
	
//Finds the minimized equation for the current KMap.
function Search()
{
    var Rects = new Array();
    Cover(CreateRect(0, 0, KMap.Width, KMap.Height), false);

    // Find the (larger) rectangles that cover just the quares in the KMap
    //  and search for smaller and smaller rects
    SearchRect(4, 4, true, Rects, true);
    SearchRect(4, 2, true, Rects, true);
    SearchRect(2, 4, true, Rects, true);
    SearchRect(1, 4, true, Rects, true);
    SearchRect(4, 1, true, Rects, true);
    SearchRect(2, 2, true, Rects, true);

    // 2x1 sized rects  - These have to be handled specially in order to find a 
    //  minimized solution.  
    var Rects2x1 = new Array();
    SearchRect(2, 1, true, Rects2x1, false);
    SearchRect(1, 2, true, Rects2x1, false);

    // Collect all the larger rectangles (Step 1 - Explanation)
    LargeRects = Rects.concat(Rects2x1);

    // FindBestCoverage(Rects2x1, Rects);

    var BestCoverage = FindBestCoverage(Rects2x1, Rects);

    //Clone the BestCoverage to global scope variables for displaying
    Step4Equations = BestCoverage.slice(0);

    // add the 1x1 rects
    // SearchRect(1, 1, true, Rects, true);

    //check to see if any sets of (necessary) smaller rects fully cover larger ones (if so, the larger one is no longer needed)
 //    Cover(CreateRect(0, 0, KMap.Width, KMap.Height), false);
 //    for (i = Rects.length - 1; i >= 0; i--)
 //    {
 //        if (IsCovered(Rects[i]))
 //        {
 //            Rects[i] = null;
 //        }
 //        else
 //        {
 //            Cover(Rects[i], true);
 //        }
 //    }

	ClearEquation();

	// for (i = 0; i < Rects.length; i++)
	// {
	// 	if (Rects[i]!=null)
	// 	{
	// 		//transfer from Rect to equations (minterms) and add to SolEquation
	// 		RectToEquation(Rects[i],SolEquation);
	// 	}
	// }
	// if (SolEquation.NumOfTerms==0)
	// {
	// 	SolEquation.NumOfTerms=1;
	// 	SolEquation[0].Expression="0";
	// 	SolEquation[0].Rect = CreateRect(0,0,KMap.Width,KMap.Height);
	// }
	console.log('BestCoverage',BestCoverage);

	if (BestCoverage.length != 0){
		var tempRects = BestCoverage[0].slice(0);
		for (i = 0; i < tempRects.length; i++)
		{
			if (tempRects[i]!=null)
			{
				//transfer from Rect to equations (minterms) and add to SolEquation
				RectToEquation(tempRects[i],SolEquation);
			}
		}
	}
	
	if (SolEquation.NumOfTerms==0)
	{
		SolEquation.NumOfTerms=1;
		SolEquation[0].Expression="0";
		SolEquation[0].Rect = CreateRect(0,0,KMap.Width,KMap.Height);
	}
}

function ClearEquation()
{
	for (i=0; i<SolEquation.length; i++)
	{
		SolEquation[i].Rect	= null;
	}
	SolEquation.NumOfTerms=0;
}

// returns true if the rect is entirely within a single given variable 
function IsConstantVariable( Rect, Variable )
{
	var dx=0;
	var dy=0;
	var topleft = KMap[Rect.x][Rect.y].Variable[Variable];
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			test = KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Variable[Variable];
			if (test!=topleft)
			{
				return false;
			}
		}
	}
	return true;
}

// Turns a rectangle into a text minterm (in HTML) and store it into the desired equation array
function RectToEquation( Rect, EquationArr)
{
	var Text = "";
	var i=0;
	for (i=0; i<VariableCount; i++)
	{
		if (IsConstantVariable( Rect, i))
		{
			// Text += VariableNames[i];
			// if (!KMap[Rect.x][Rect.y].Variable[i])
			// {
			// 	Text += "'";
			// }
			if (!KMap[Rect.x][Rect.y].Variable[i])
			{
				Text += "<span style='text-decoration: overline'>"+VariableNames[i]+"</span> ";
			}
			else
			{
				Text += VariableNames[i] + " ";
			}
		}
	}
	if (Text.length==0)
	{
		Text="1";
	}
	if (EquationArr == SolEquation){
		EquationArr[EquationArr.NumOfTerms].Rect = Rect;
		EquationArr[EquationArr.NumOfTerms].Expression = Text;
		EquationArr.NumOfTerms++;
	}
	return Text;
}
	

// turns a boolean into a display value  true->"1"  false->"0"
function DisplayValue( bool )
{
	if (bool==true)
	{
		return "1";
	}
	else if (bool==false)
	{
		return "0";
	}
	else return DontCare;
}

// Check to see if the KMap[w][h] cell is covered by the LargeRect or not 
// Say in different way: Check to see whether a cell at position w,h belong to the given LargeRect
function isCoveredByRectIndex(w,h,LargeRect)
{
	var MaxX = LargeRect.x + LargeRect.w -1;
	var MinX = LargeRect.x;
	var MaxY = LargeRect.y + LargeRect.h -1;
	var MinY = LargeRect.y;
	if (MaxY >= KMap.Height && MaxX < KMap.Width){
		if (MinX <= w && w <= MaxX && ( (h <= (MaxY % KMap.Height)) || ((MinY <= h) && (h <= (KMap.Height-1)))  ) ){
			return true;
		}
	}
	else if (MaxX >= KMap.Width && MaxY < KMap.Height){
		if (MinY <= h && h <= MaxY && ( (w <= (MaxX % KMap.Width)) || ((MinX <= w) && (w <= (KMap.Width-1))) ) ){
			return true;
		}
	}
	else if (MaxY >= KMap.Height && MaxX >= KMap.Width){
		if ( ( (w <= (MaxX % KMap.Width)) || ((MinX <= w) && (w <= (KMap.Width-1))) ) &&  ( (h <= (MaxY % KMap.Height)) || ((MinY <= h) && (h <= (KMap.Height-1)))  )){
			return true;
		}
	}
	else {
		if (MinX <= w && w <= MaxX && MinY <= h && h <= MaxY){
			return true;
		}
	}
	return false;
}


//Find all the Rects (in LargeRects) that cover the cell at position [dx][dy]
function rectsCoveringCellAt(dx,dy){
	var RectsOfCell = new Array();
	for (var i = 0; i < LargeRects.length; i++){
		if (isCoveredByRectIndex(dx,dy,LargeRects[i]) == true){
			// return LargeRects[i];
			RectsOfCell.push(LargeRects[i]);
		}
	}
	return RectsOfCell;
}

//Check to see if the given list of Rects (minimalRects) cover all the cell in Kmap using the Kmap
//Because before adding a new minimalRect, we increase the weight of every cell covered by that minimalRect by 100
//so that we just need to check all the weight map for any weight that:   0  < weight < 100
function isKMapCoveredBy(Weights,MinimalRects){
	for (var i = 0; i < Weights.length; i++ ){
		for (var j = 0; j < Weights[0].length; j++){
			if ((0 < Weights[i][j]) && (Weights[i][j] < 100)){
				return false;
			}
		}
	}
	return true;
}

//Step 3 - find all the leftover cells that is not be covered by the rects found in Step 2
function findLeftoverCells(Weights){
	var LeftoverCells = new Array();
	//Every leftover cell will store:
	// 1) the position 
	// 2) Rects that is covering the leftover cell (more than 2 because leftover cells are not 1-weight cell)

	for (var dx = 0; dx < Weights.length; dx++ ){
		for (var dy = 0; dy < Weights[0].length; dy++){
			if ((0 < Weights[dx][dy]) && (Weights[dx][dy] < 100)){
				// var curPos = {x: dy+1, y: dx+1};
				var Cell = {Pos: {x: dy+1, y: dx+1}, Rects: rectsCoveringCellAt(dx,dy).slice(0) };
				LeftoverCells.push(Cell);
			}
		}
	}
	return LeftoverCells;
}


//Step 3 - List down all the possible options and evaluate to find the smallest coverage using Back-tracking method
function determinePossibleCombs(LeftoverCells){
	var remainCells = LeftoverCells.slice(0); 			// make a clone of LeftoverCells to feed to the backtracking
	var availableRects = ListAvailableRects(LeftoverCells);
	var resultsCombs = new Array();					// Store all the accepted combinations (results)
	var currentComb = new Array();

	findCombination(0, remainCells, availableRects, currentComb, resultsCombs);
	return resultsCombs;
}

//Step 3 - List out all the Rects that is available to choose to cover the remaining cells (exclude the Step2Rects)
function ListAvailableRects(LeftoverCells){
	var availableRects = new Array();
	var step2_tempRects = new Array();    //Make a Rects array out from Step2Rects's structure
	for (var k = 0; k < Step2Rects.length; k++){
		step2_tempRects.push(Step2Rects[k].Rect);
	}

	for (var i = 0; i < LeftoverCells.length; i++){
		for (var j = 0; j < LeftoverCells[i].Rects.length; j++){
			if ((!IsRectDuplicateIn(LeftoverCells[i].Rects[j],availableRects)) && (!IsRectDuplicateIn(LeftoverCells[i].Rects[j],step2_tempRects))){
				// Push to availableRects
				availableRects.push(LeftoverCells[i].Rects[j]);
			}
		}
	}
	return availableRects;
}

//Step 3 - Backtracking 
function findCombination(start, remainCells, availableRects, currentComb, resultsCombs){
 	if(remainCells.length > 0 && (start == availableRects.length - 1)){
 		return;
 	}
 	else if (remainCells.length == 0){
 		resultsCombs.push(currentComb);
 		return;
 	}
 	else {
 		for (var i = start; i < availableRects.length; i++){
			if(!IsRectDuplicateIn(availableRects[i],currentComb))
				currentComb.push(availableRects[i]);
 			findCombination(i+1, removeCoveredCells(remainCells,availableRects[i]), availableRects, currentComb, resultsCombs);
 			currentComb = currentComb.slice(0,-1);
 		}
 	}
}

 
// Remove all the cells that are covered by the given Rect
function removeCoveredCells(remainCells, givenRect){
	var updatedCells = remainCells.slice(0);
	if (updatedCells.length == 0){
		return updatedCells;
	}
	for (var i = 0; i < updatedCells.length; i++){
		if (IsRectDuplicateIn(givenRect,updatedCells[i].Rects)){
			// Remove the cell that has been covered by the given rect (Remove 1 element at the index i)
			updatedCells.splice(i,1);
		}
	}
	return updatedCells;

	// for (var i = 0; i < remainCells.length; i++){
	// 	if (IsRectDuplicateIn(givenRect,remainCells[i].Rects)){
	// 		// Remove the cell that has been covered by the given rect (Remove 1 element at the index i)
	// 		remainCells.splice(i,1);
	// 	}
	// }
	// console.log('remainCells',remainCells);
}


//Step 3 - Is the chosen Rect duplicate (already) in the Rects array 
function IsRectDuplicateIn(Rect, RectsArr){
	for (var i = 0; i < RectsArr.length; i++){
		if (Rect.x == RectsArr[i].x &&
			Rect.y == RectsArr[i].y &&
			Rect.w == RectsArr[i].w && Rect.h == RectsArr[i].h){
			return true;
		}
	}
	return false;
}

// Compare 2 rects 
function areRectsEqual(RectA, RectB){
	if (RectA.x == RectB.x &&
		RectA.y == RectB.y &&
		RectA.w == RectB.w && 
		RectA.h == RectB.h){
		return true;
	}
	return false;
}


// Turns a number into binary in text (prepends 0's to length 'bits')
function BinaryString( value, bits )
{
	var str = value.toString(2);
	var i=0;
	for (i=0; i<bits; i++)
	{
		if (str.length<bits)
		{
			str = "0" + str;
		}
	}
	return str;
}


//Reset the KMap Covered attribute
function resetKMapCovered(){
	for (let i = 0; i < KMap.Width; i++){
		for (let j = 0; j <KMap.Width; j++){
			KMap[i][j].Covered = false;
		}
	}
}


//Check to see if KMap is covered by the given Comb + along with the Step2Rects 
function isKMapCovereByCurrentCombination(curComb){
	//Reset the .Covered flag
	resetKMapCovered();

	for (let i = 0; i < Step2Rects.length; i++){
		Cover(Step2Rects[i].Rect,true);
	}

	for (let i = 0; i < curComb.length; i++){
		Cover(curComb[i],true);
	}

	for (let i = 0; i < KMap.Width; i++){
		for (let j = 0; j <KMap.Width; j++){
			if(KMap[i][j].Value == 1 && KMap[i][j].Covered == false){
				return false;
			}
		}
	}
	return true;
} 

// Find and append sole Rects 1x1 that don't belong to any LargeRects
function addSoleRects1x1(curComb){
	resetKMapCovered();
	for (let i = 0; i < Step2Rects.length; i++){
		Cover(Step2Rects[i].Rect,true);
	}

	for (let i = 0; i < curComb.length; i++){
		Cover(curComb[i],true);
	}

	for (let i = 0; i < KMap.Width; i++){
		for (let j = 0; j <KMap.Width; j++){
			if(KMap[i][j].Value == 1 && KMap[i][j].Covered == false){
				curComb.push(CreateRect(i,j,1,1));
				Cover(CreateRect(i,j,1,1), true);
			}
		}
	}
}

//Return total weight of a combination
function combWeight(curComb){
	var totalweight = 0;
	for (var i = 0; i < curComb.length; i++){
		totalweight += curComb[i].w * curComb[i].h;
	}
	return totalweight;
}


// redraws UI (with no highlights)
function UpdateUI()
{
    var i = 0;
    for (i = 0; i < TruthTable.length; i++)
    {
        var Val = DisplayValue(TruthTable[i].KMapEntry.Value);
        //Truth Table
  
        SetValue(TruthTable[i].ButtonUIName, Val);
        SetBackgroundColor(TruthTable[i].ButtonUIName, HighlightColor(Val));
        SetBackgroundColor(TruthTable[i].TTROWUIName, HighlightColor(Val));

        //KMap
        SetValue(TruthTable[i].KMapEntry.ButtonUIName, Val);
        SetBackgroundColor(TruthTable[i].KMapEntry.ButtonUIName, HighlightColor(Val));
        SetBackgroundColor(TruthTable[i].KMapEntry.TDUIName, HighlightColor(Val));
    }
    SetInnerHTML("EquationDiv", GenerateEquationHTML());
    SetInnerHTML("Step_1",GenerateStep1HTML());
    SetInnerHTML("Step_2",GenerateStep2HTML());
    SetInnerHTML("Step_3",GenerateStep3HTML());
    SetInnerHTML("Step_4",GenerateStep4HTML());
}
	
function ToggleValue( Value )
{
	if (AllowDontCare)
	{
		if (Value==true)
		{
			return DontCare;
		}
		else if (Value==DontCare)
		{
			return false;
		}
		else if (Value==false)
		{
			return true;
		}
	}
	else
	{
		return !Value;
	}
}

function ToggleTTEntry( TTEntry )
{
	TTEntry.KMapEntry.Value = ToggleValue(TTEntry.KMapEntry.Value);
	RefreshUI();
}

function ToggleKMEntry( KMEntry )
{
	KMEntry.Value = ToggleValue(KMEntry.Value);
	RefreshUI();
}

function RefreshUI()
{
	ClearEquation();
	Search();
	UpdateUI();
}

// redraws UI with the given equation highlighted
function SetShowRect( EquationEntry, EquationIndex )
{	
	if (EquationEntry==null)
	{
		UpdateUI();
		return;
	}
	else
	{
	    var ShowRect = EquationEntry.Rect;

	    var dx = 0;
        var dy = 0;
        for (dx = 0; dx < ShowRect.w; dx++)
        {
            for (dy = 0; dy < ShowRect.h; dy++)
            {
                var KMEntry = KMap[(ShowRect.x + dx) % KMap.Width][(ShowRect.y + dy) % KMap.Height];
                // console.log('KMEntry',KMEntry);
                var Val = DisplayValue(TruthTable[i].KMapEntry.Value);
                //KMap
                SetBackgroundColor(KMEntry.ButtonUIName, RectHighlightColor(Val));
                SetBackgroundColor(KMEntry.TDUIName, RectHighlightColor(Val));
                //Truth Table
                SetBackgroundColor(KMEntry.TruthTableEntry.ButtonUIName, RectHighlightColor(Val));
                SetBackgroundColor(KMEntry.TruthTableEntry.TTROWUIName, RectHighlightColor(Val));
            }
        }
	}
	SetBackgroundColor(SolEquation[EquationIndex].ButtonUIName,EquationHighlightColor);
}

function GetElement(Name)
{
	if (document.getElementById)
	{
		return document.getElementById(Name);
	}
	else if (document.all)
	{
		return document.all[Name];
	}
	else if (document.layers)
	{
		return document.layers[Name]//not sure this works in all browsers... element.style would be document.layers[Name];
	}
}

function SetInnerHTML(Name,Text)
{
	GetElement(Name).innerHTML = Text
}

function SetBackgroundColor(Name,Color)
{
	GetElement(Name).style.backgroundColor = Color;
}

function SetValue(Name,Value)
{
	GetElement(Name).value = Value;
}

function GenerateTruthTableHTML()
{
	var Text = "<table ID=\"TruthTableID\" style=\"text-align:center\">";
	{
		Text = Text + "<thead style=\"background: rgb(49,60,78);text-align:center\"><tr>";
		var i=0;
		for (i=0; i<VariableCount; i++)
		{
			Text = Text + "<th>"+VariableNames[i]+"</th>";
		}
		Text = Text + "<th>"+FunctionText+"</th></tr></thead>";
			
		for (i=0; i<TruthTable.length; i++)
		{
			if (i % 2 == 0)
			{ 
				var opacity = 0.85;
			}else{
				var opacity = 0.8;
			}

			Text += "<tr ID='"+TruthTable[i].TTROWUIName+"' style=\"opacity: " +opacity+ "\">";  
			var j=0;
			for (j=0; j<VariableCount; j++)
			{
				if (DisplayValue(TruthTable[i][j].Variable) == 1) {
					var color = "style=\"background-color: rgba(255,255,255,.3);font-weight: bold\""
				}else{
					var color = "";
				}

				Text = Text + "<td " + color + ">"+ DisplayValue(TruthTable[i][j].Variable)+"</td>";
			}
			Text = Text
				+ "<td><input class=\"remove-bottom full-width\" ID=\""+TruthTable[i].ButtonUIName +"\" name="+TruthTable[i].ButtonUIName +" type='button' value='"+DisplayValue(TruthTable[i].KMapEntry.Value)+"' onClick=\"ToggleTTEntry(TruthTable["+i+"])\" ></td>" 
				+ "</tr>";
		}
	}
	Text = Text + "</table>";
	return Text;
}

function GenerateKMapHTML()
{
	var Text = "<table><thead><tr>";
	var h,w;
	Text = Text + "<th colspan=\"2\" ></th><th style=\"background: rgb(49,60,78);border-bottom:2px solid rgb(31, 39, 55)\" colspan="+(KMap.Width)+">";

	for (i=0; i<KMap.XVariables; i++)
	{
		Text += VariableNames[i];
	}
	
	Text += "</th></tr></thead>";
	Text += "<tbody><tr>";
	Text += "<th ></th><th style=\"border-left: none !important\"></th>";

	for (i=0; i<KMap.Width; i++)
	{
		if (VariableCount == 2)
			Text += "<th class=\"header-color\" style=\"background: rgb(49,60,78)\">"+BinaryString(BitOrder[i+2],KMap.XVariables)+"</th>";
		else Text += "<th class=\"header-color\" style=\"background: rgb(49,60,78)\">"+BinaryString(BitOrder[i],KMap.XVariables)+"</th>";
	}
	Text+="</tr>";
	
	for (h=0; h<KMap.Height; h++)
	{
		if (h % 2 != 0)
		{ 
			var opacity = 0.85;
		}else{
			var opacity = 0.8;
		}
		Text = Text + "<tr style=\"opacity:" +opacity + "\">";
		if (h==0)
		{
			Text += "<th style=\"background: rgb(49,60,78); width: 15%\" rowspan="+((KMap.Height) + 2)  +">";
			for (i=0; i<KMap.YVariables; i++)
			{
				Text += "<b class=\"header-color\">" + VariableNames[i+KMap.XVariables] + "</b>";
			}
		}
		if (VariableCount == 2 || VariableCount == 3)
			Text += "<th class=\"header-color\" style=\"border-left: 2px solid rgb(31, 39, 55);background: rgb(49,60,78);width: 15%\" >"+BinaryString(BitOrder[h+2],KMap.YVariables)+"</th>";
		else Text += "<th class=\"header-color\" style=\"border-left: 2px solid rgb(31, 39, 55);background: rgb(49,60,78);width: 15%\" >"+BinaryString(BitOrder[h],KMap.YVariables)+"</th>";

		for (w=0; w<KMap.Width; w++)
		{

			Text += "<td  ID='"+KMap[w][h].TDUIName+"' style='text-align:center;'>"
					+ "<input class=\"remove-bottom full-width\" ID="+KMap[w][h].ButtonUIName +" name="+KMap[w][h].ButtonUIName +" type='button'  value='"+DisplayValue(KMap[w][h].Value)+"' onClick=\"ToggleKMEntry(KMap["+w+"]["+h+"])\">"
					+ "</td>";
		}
		Text += "</tr>";
	}
	Text +="</td></tr></tbody></table>";
	return Text;
}

function GenerateKMapHTMLfrom(Rects) 
{
	var Text = "<table>"
	
	for (h=0; h<KMap.Height; h++)
	{
		if (h % 2 != 0)
		{ 
			var opacity = 0.85;
		}else{
			var opacity = 0.8;
		}
		Text = Text + "<tr style=\"opacity:" +opacity + "\">";
		
		for (w=0; w<KMap.Width; w++)
		{
			var flag = false;
			for (var k = 0; k < Rects.length; k++){
				if(isCoveredByRectIndex(w,h,Rects[k].Rect) == false){
					flag = false;
				}
				else{
					flag = true;
					break;
				}
			}
			if (flag == false){
				Text += "<td style='background-color: rgb(0, 195, 151); text-align:center;'>"+ DisplayValue(KMap[w][h].Value) + "</td>";
			}
			else {
				Text += "<td style='background-color: rgb(200, 90, 60); text-align:center;'>"+ DisplayValue(KMap[w][h].Value) + "</td>";
			}
		}
		Text += "</tr>";
	}
	Text +="</table>";
	return Text;
}


function GenerateEquationHTML()
{
	var j;
	var i;
	for (i=0; i<SolEquation.NumOfTerms; )
	{
		var Text = "<p class=\"header-color remove-bottom\">";
		for (j=0; (j < 8) && (i<SolEquation.NumOfTerms); j++)
		{
			if (i==0) Text+= "<b>"+FunctionText + " = ";
			Text += "<span class=\"blue button half-bottom\" id=\""+SolEquation[i].ButtonUIName + "\" onMouseOver=\"SetShowRect(SolEquation["+i+"],"+i+");\" onMouseOut=\"SetShowRect(null);\" style=\"padding:5px\">";
			Text += "<b>" + SolEquation[i].Expression + "</span>";
			if (i<SolEquation.NumOfTerms-1) Text +=" <span> + </span>";
			i++;
		}	
		Text += "</p>";
	}
	return Text;
}

function GenerateStep1HTML(){
	var i;
	var Text = "<p class=\"header-color remove-bottom\" style=\"padding: 5px 10px !important;\"><b>Bước 1:</b> Biểu đồ Karnaugh của <i>f</i> có "+LargeRects.length+" tế bào lớn:";
	for (i = 0; i < LargeRects.length; i++){
		// Special case: have to make a tempArr which have only 1 rect inside (which is LargeRects[i])
		var DemoRects = new Array();
		DemoRects.push({Rect:LargeRects[i],Pos:"temp"});
		Text += "<div class=\"Step1KMaps\">" + GenerateKMapHTMLfrom(DemoRects);
		Text += "<span class=\"caption\">";
		if(LargeRects[i]!=null){
			Text += RectToEquation(LargeRects[i])+"</span></div>";
		}
	}
	Text += "</p>";
	if (LargeRects.length > 0){
		$("#StepByStep").show();
	}
	return Text;
}


function GenerateStep2HTML(){
	var Text =  "<p><b>Bước 2:</b> Ta có ";
	for (var i = 0; i < Step2Rects.length; i++){
		if (i <= Step2Rects.length-3){
			Text += "ô <b>"+ "("+ Step2Rects[i].Pos.x +","+ Step2Rects[i].Pos.y+ ")" + "</b> nằm trong tế bào lớn duy nhất là <b>"+ RectToEquation(Step2Rects[i].Rect) + "</b>, " ;
		}
		else if (i == Step2Rects.length-2){
			Text += "ô <b>"+ "("+ Step2Rects[i].Pos.x +","+ Step2Rects[i].Pos.y+ ")"  + "</b> nằm trong tế bào lớn duy nhất <b>"+ RectToEquation(Step2Rects[i].Rect) + "</b> và ";
		}
		else {
			Text += "ô <b>"+ "("+ Step2Rects[i].Pos.x +","+ Step2Rects[i].Pos.y+ ")"  + "</b> nằm trong tế bào lớn duy nhất là <b>"+ RectToEquation(Step2Rects[i].Rect) + "</b>.<br>";
		}
	}
	Text += "Gạch chéo "+ Step2Rects.length + " tế bào này, ta được biểu đồ Karnaugh của f như sau:</p>"
	Text += "<div class=\"Step1KMaps\">" + GenerateKMapHTMLfrom(Step2Rects) +"</div>";
	if(flagStep3 == false){
		Text += "<p>&rArr; Ta nhận thấy biểu đồ Karnaugh đã được phủ kín </p>";
	}
	else {
		if (LeftoverCells.length == 1){
			Text += "<p>&rArr; Còn lại ô "+ "<b>("+ LeftoverCells[0].Pos.x +","+ LeftoverCells[0].Pos.y+ ")</b>" + " chưa được phủ nên ta qua Bước 3 </p>";
		}
		else {
			Text += "<p>&rArr; Còn lại các ô: ";
			for (var i = 0; i < LeftoverCells.length; i++){
				if( i < LeftoverCells.length-1)
					Text += "<b>("+ LeftoverCells[0].Pos.x +","+ LeftoverCells[0].Pos.y+ ")</b>, ";
				else 
					Text += "và <b>("+ LeftoverCells[0].Pos.x +","+ LeftoverCells[0].Pos.y+ ")</b>";
			}
			Text += " chưa được phủ nên ta qua Bước 3 </p>";
		}	
	}
	return Text;
}

function GenerateStep3HTML(){
	var Text =  "<p><b>Bước 3: </b>";
	if(flagStep3 == true){
		$("#Step_3").show();
		if (LeftoverCells.length == 1){
			Text += " ô "+ "<b>("+ LeftoverCells[0].Pos.x +","+ LeftoverCells[0].Pos.y+ ")</b>" + " nằm trong "+ LeftoverCells[0].Rects.length
			+" tế bào lớn là: ";

			for (var i = 0; i < LeftoverCells[0].Rects.length; i++){
				if (i < LeftoverCells[0].Rects.length-1)
					Text += "<b>"+ RectToEquation(LeftoverCells[0].Rects[i]) + "</b>, ";
				else
					Text += "<b>"+ RectToEquation(LeftoverCells[0].Rects[i]) + "</b>";
			}
			Text += " nên ta chọn tùy ý một trong các tế bào trên ta đều phủ kín biểu đồ Karnaugh của <i>f</i> </p>";
		}
	}
	return Text;
}

function GenerateStep4HTML(){
	var Text =  "<p><b>Bước 4: </b>Ta được phép phủ tối thiểu tương ứng với các công thức đa thức:<br>";
	for (var i = 0; i < Step4Equations.length; i++){
		Text+= "&nbsp;&nbsp;&nbsp;&nbsp;"+ FunctionText + " ("+ (i+1) +") <b>" + " = ";
		for (var j = 0; j < Step4Equations[i].length; j++){
			if(j < Step4Equations[i].length-1){
				Text += RectToEquation(Step4Equations[i][j]);
				Text += " + ";
			}
			else
				Text += RectToEquation(Step4Equations[i][j]) + "</b>";
		}
		Text += "<br>";
	}
	if (Step4Equations.length == 1){
		Text += "Ta chỉ có duy nhất một phép phủ tương đương với công thức đa thức tối tiểu của <i>f</i>."
	}
	else if (Step4Equations.length == 2){
		if(combWeight(Step4Equations[0]) == combWeight(Step4Equations[1])){
			Text += "Cả hai công thức này đều đơn giản như nhau nên ta được 2 công thức đa thức tối tiểu:<br>";
			Text += "<p>&rArr; "+ FunctionText + " = <b>";
			for (var i = 0; i < Step4Equations.length; i++){
				for (var j = 0; j < Step4Equations[i].length; j++){
					if(j < Step4Equations[i].length-1){
						Text += RectToEquation(Step4Equations[i][j]);
						Text += " + ";
					}
					else
						Text += RectToEquation(Step4Equations[i][j]) + "</b>";
				}
			if (i == Step4Equations.length-2)
				Text += "</b> hoặc <b>";
			}
			Text += "</b>";
		}
		else if(combWeight(Step4Equations[0]) != combWeight(Step4Equations[1])){
			var minimal = (combWeight(Step4Equations[0]) > combWeight(Step4Equations[1]))?0:1 ;
			Text += "Ta có hai công thức đa thức tương ứng nhưng chỉ có công thức ("+ (minimal+1) +") là tối tiểu<br>";
			Text += "<p>&rArr; "+ FunctionText + " = <b>";

			for (var j = 0; j < Step4Equations[minimal].length; j++){
				if(j < Step4Equations[minimal].length-1){
					Text += RectToEquation(Step4Equations[minimal][j]);
					Text += " + ";
				}
				else
					Text += RectToEquation(Step4Equations[minimal][j]) + "</b>";
			}
		}
	}
	return Text;
}

function ChangeVariableNumber( Num )
{
	InitializeTables(Num);
	ClearEquation();
	SetInnerHTML("TruthTableDiv",GenerateTruthTableHTML());
	SetInnerHTML("KarnoMapDiv",GenerateKMapHTML());
	SetInnerHTML("EquationDiv",GenerateEquationHTML());
	GetElement("TwoVariableRB").checked   = (Num==2)?true:false;
	GetElement("ThreeVariableRB").checked = (Num==3)?true:false;
	GetElement("FourVariableRB").checked  = (Num==4)?true:false;
	Search();
	SetInnerHTML("Step_1",GenerateStep1HTML());
	SetInnerHTML("Step_2",GenerateStep2HTML());
	SetInnerHTML("Step_3",GenerateStep3HTML());
	SetInnerHTML("Step_4",GenerateStep4HTML());
	UpdateUI();
}

function ToggleDontCare()
{
	AllowDontCare=!AllowDontCare;
	var i=0;
	for (i=0;i<TruthTable.length; i++)
	{
		if (TruthTable[i].KMapEntry.Value==DontCare)
		{
			TruthTable[i].KMapEntry.Value=false;
		}
	}
	ChangeVariableNumber(VariableCount);
	GetElement("AllowDontCareCB").checked = AllowDontCare;
}

function PageParameter( Name )
{
	var Regex = new RegExp( "[\\?&]"+Name+"=([^&#]*)" );
	var Results = Regex.exec( window.location.href );
	if( Results != null )
	{
		return Results[1];
	}
	return "";
}


//Update the variable names if there is any change being made
document.getElementById('variablenames').addEventListener('change', function() {

	//Check if empty
	if(isNaN(this.value)){
		var NewVariableString = this.value.toUpperCase();
		var UpdatedVarArray = NewVariableString.split(" ");

		//Only update if the new variables name is less than 4 letters
		if(UpdatedVarArray.length <= 4) {
			//Update the variables' names
			VariableNames = UpdatedVarArray.slice();

			//Refresh the window's elements with the new Variables Names
			InitializeTables(VariableCount);
			ClearEquation();
			SetInnerHTML("TruthTableDiv",GenerateTruthTableHTML());
			SetInnerHTML("KarnoMapDiv",GenerateKMapHTML());
			SetInnerHTML("EquationDiv",GenerateEquationHTML());
			GetElement("TwoVariableRB").checked   = (VariableCount==2)?true:false;
			GetElement("ThreeVariableRB").checked = (VariableCount==3)?true:false;
			GetElement("FourVariableRB").checked  = (VariableCount==4)?true:false;
			Search();
			UpdateUI();
		}
		else{
			alert("Invalid number of variables");
			//Reset the input
			this.value = "";
		}
	}
});


