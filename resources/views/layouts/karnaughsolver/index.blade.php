@extends('index')
@section('extra-style')
	{{Html::style('custom/css/karnaugh/newkarnaugh_style.css')}}
@endsection

@section('contents')
	<!-- main content -->
	<div class="karnaugh-main">

		<div class="fluid container add-bottom">
			
	    	<div class="sixteen columns well add-bottom">
	    		<input type="text" class="remove-bottom half-width pull-left" id="variablenames" placeholder="Input variables name (max is 4)" style="font-style: italic;">
	    		<br>
	    		<br>
	    		<p class="header-color half-bottom">
					<small>
						Type in your variable's <b> NAMES </b> separated with a space (e.g. <b>A B C D</b>)
						<br>
						Note: <b>X Y Z T</b> is by default 
					</small>
				</p>
				<input type="text" class="remove-bottom full-width pull-center" id="equation" placeholder="Input the equation" style="font-style: italic;">
				<p class="header-color half-bottom">
					<small>
						Use <b>!</b> to represent <b>NOT</b> and <b>+</b> for <b>OR</b> (e.g. <b>XYZT + !XY!Z + X!YT</b>)
					</small>
				</p>  
				<div id="EquationDiv">
				</div>        
			</div>

			<div class="sixteen columns well add-bottom">
				<div class="pull-center">
					<label for"variables" class="dark button half-bottom" style="text-align:left">
						<input type="radio" onClick="ChangeVariableNumber(2)" ID="TwoVariableRB" name="variables" class="dark remove-bottom">
						Two Variables
					</label>

					<label for"variables" class="dark button half-bottom" style="text-align:left">
						<input type="radio" onClick="ChangeVariableNumber(3)" ID="ThreeVariableRB" name="variables" class="dark remove-bottom">
						Three Variables
					</label>

					<label for"variables" class="dark button half-bottom" style="text-align:left">
						<input type="radio" onClick="ChangeVariableNumber(4)" ID="FourVariableRB" name="variables" class="dark remove-bottom">
						Four Variables
					</label>

					<label for"care" class="dark button half-bottom " style="text-align:left"> 
						<input type="radio" onClick="ToggleDontCare()" ID="AllowDontCareCB" name="care" class="dark remove-bottom">
						Allow Don't Care
					</label>
				</div>
				
				<div class="eight columns add-bottom">    
					<p class="pull-center"><b>Truth Table</b></p>
				    <div id="TruthTableDiv">
					</div>     
				</div>

			    <div class="eight columns add-bottom">    
					<p class="pull-center"><b>Karnaugh Map</b></p>
				   	<div id="KarnoMapDiv">
					</div>
				</div>
			</div>
		</div>
	</div>    
@endsection

@section('extra-script')
	{{Html::script('custom/js/karnaugh/karnaugh_app.js')}}
    {{Html::script('custom/js/karnaugh/karnaugh_equation.js')}}
@endsection