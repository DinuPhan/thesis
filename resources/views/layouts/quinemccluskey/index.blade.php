@extends('index')
@section('extra-style')
    {{Html::style('custom/css/quine_mccluskey/quine_mccluskey_style.css')}}
@endsection

@section('contents')
        <div class="quine-main">

            <div class="fluid container add-bottom">
                
                <div class="sixteen columns well add-bottom">
                    <div class="eight columns add-bottom" style="display: block">
                        <label class="header-color remove-bottom half-width pull-left" for="Input"><font size=4>F = Σ<small>m  &nbsp;</small></font></label>
                         <input type="text" class="remove-bottom half-width pull-center" id="Minterms" placeholder="Nhập các minterms" style="font-style: italic;">
                         <br>
                         <br>
                        <p class="header-color half-bottom">
                            <small>
                                Nhập các <b> Minterms </b> dưới dạng thập phân và cách nhau bằng <b>1 dấu phẩy</b> (Vd: <b>0,1,5,7,8,10,14,15</b>)
                            </small>
                        </p>
                    </div>
                    
                    <div class="eight columns add-bottom" style="display: block">
                        <input type="text" class="remove-bottom full-width pull-center" id="DNFequations" placeholder="Nhập đa thức dưới dạng nối rời chính tắc" style="font-style: italic;">
                        <p class="header-color half-bottom">
                            <br>
                            <small>
                                Lưu ý: Có thể dùng dấu <b>!</b> để biểu diễn <b>NOT</b> và dấu <b>+</b> cho <b>OR</b> <br>(Vd: <b>XYZT + !XY!Z + X!YT</b>)
                            </small>
                        </p>  
                    </div> 
                    
                   {{--  <div id="TruthTable">
                         <div class="eight columns add-bottom pull-left" style="display: block">    
                            <p class="pull-center"><b>Bảng chân trị</b></p>
                            <div id="TruthTableDiv">
                            </div>     
                        </div>
                    </div>
 --}}               
                    <div class = "eight columns add-bottom pull-left">
                         <input id="clickSimplify" type="button" class="button" value="Xử lý" onClick="main();" />
                    </div>       
                </div>

                 <div id=output>
                    <!-- Answer goes here -->
                </div>

                <div id="grouping">
                    <!-- Grouping steps go here -->
                </div>

                <div id="coverTables">
                    <!-- Implicants/Minterms tables go here -->
                </div>
                
            </div>
    </div>


@endsection


@section('extra-script')
	{{Html::script('custom/js/quine_mccluskey/Branching.js')}}
	{{Html::script('custom/js/quine_mccluskey/Elimination.js')}}
	{{Html::script('custom/js/quine_mccluskey/Grouping.js')}}
	{{Html::script('custom/js/quine_mccluskey/Implicants.js')}}
	{{Html::script('custom/js/quine_mccluskey/Input.js')}}
	{{Html::script('custom/js/quine_mccluskey/MainFunction.js')}}
	{{Html::script('custom/js/quine_mccluskey/Output.js')}}
@endsection