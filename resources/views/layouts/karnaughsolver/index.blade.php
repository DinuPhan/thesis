@extends('index')
@section('extra-style')
	{{Html::style('custom/css/karnaugh/newkarnaugh_style.css')}}
@endsection

@section('contents')
	<!-- main content -->
	<div class="karnaugh-main">

		<div class="fluid container add-bottom">
			
	    	<div class="sixteen columns well add-bottom">
	    		<input type="text" class="remove-bottom half-width pull-left" id="variablenames" placeholder="Nhập tên các biến (tối đa: 4 biến)" style="font-style: italic;">
	    		<br>
	    		<br>
	    		<p class="header-color half-bottom">
					<small>
						Nhập <b> TÊN </b> các biến cách nhau bởi 1 khoảng trắng - space (Vd: <b>A B C D</b>)
						<br>
						<em> Nếu không thay đổi thì chương trình nhận các biến mặc định là </em><b>X Y Z T</b>
					</small>
				</p>
				<input type="text" class="remove-bottom full-width pull-center" id="equation" placeholder="Nhập các đa thức" style="font-style: italic;">
				<p class="header-color half-bottom">
					<small>
						Lưu ý: Có thể dùng dấu <b>!</b> để biểu diễn <b>NOT</b> và dấu <b>+</b> cho <b>OR</b> (Vd: <b>XYZT + !XY!Z + X!YT</b>)
					</small>
				</p>  
				<div id="EquationDiv">
				</div>        
			</div>

			<div class="sixteen columns well add-bottom">
				<div class="pull-center">
					<label for"variables" class="dark button half-bottom" style="text-align:left">
						<input type="radio" onClick="ChangeVariableNumber(2)" ID="TwoVariableRB" name="variables" class="dark remove-bottom">
						2 Biến
					</label>

					<label for"variables" class="dark button half-bottom" style="text-align:left">
						<input type="radio" onClick="ChangeVariableNumber(3)" ID="ThreeVariableRB" name="variables" class="dark remove-bottom">
						3 Biến
					</label>

					<label for"variables" class="dark button half-bottom" style="text-align:left">
						<input type="radio" onClick="ChangeVariableNumber(4)" ID="FourVariableRB" name="variables" class="dark remove-bottom">
						4 Biến
					</label>

					<label for"care" class="dark button half-bottom " style="text-align:left"> 
						<input type="radio" onClick="ToggleDontCare()" ID="AllowDontCareCB" name="care" class="dark remove-bottom">
						Allow Don't Care
					</label>
				</div>
				
				<div class="eight columns add-bottom" style="display: block">    
					<p class="pull-center"><b>Bảng chân trị</b></p>
				    <div id="TruthTableDiv">
					</div>     
				</div>

			    <div class="eight columns add-bottom" style="display: block">    
					<p class="pull-center"><b>Biểu đồ Karnaugh</b></p>
				   	<div id="KarnoMapDiv">
					</div>
				</div>
			</div>

			<div id="StepByStep">
				<div class="sixteen columns well add-bottom">
					<div class="header-color" style="text-align: center; font-size: 20px; font-weight: 600">Hướng dẫn từng bước</div>
					<div id="Step_1">
					</div>
					<div id="Step_2">
					</div>
					<div id="Step_3">
					</div>
					<div id="Step_4">
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