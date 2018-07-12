@extends('index')
@section('extra-style')
    {{Html::style('custom/css/quine_mccluskey/quine_mccluskey_style.css')}}
@endsection

@section('contents')
	{{-- <div class="container">
        <div class="jumbotron">
            <form id="Form">

                <div class="form-group">

                    <div class="row">
                        <div class="col-xs-1 col-sm-1 col-md-1 col-lg-2">
                            <label for="Input"><font size=5>F = Σ<small>m</small></font></label>
                        </div>
                        <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                            <input type="text" class="form-control" id="Minterms" value="0,1,5,7,8,10,14,15" placeholder="Enter numbers of minterms like: 2,5,..">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xs-1 col-sm-1 col-md-1 col-lg-2">
                            <label for="Input"><font size=5>+ Σ<small>d</small></font></label>
                        </div>
                        <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                            <input type="text" class="form-control" id="DontCares" placeholder="Enter numbers of don't care minterms">
                        </div>
                    </div>
                </div>

                <div class="row">

                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <!-- <input type="file" class="btn btn-primary btn-lg" onchange='readText(this)' /> -->
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right">
                        <input id="clickSimplify" type="button" class="btn btn-primary btn-lg" value="Simplify" onClick="main();" />

                    </div>

                </div>
            </form>

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
 --}}

        <div class="quine-main">

            <div class="fluid container add-bottom">
                
                <div class="sixteen columns well add-bottom">
                    <div class="eight columns add-bottom" style="display: block">
                        <label class="header-color remove-bottom half-width pull-left" for="Input"><font size=4>F = Σ<small>m  &nbsp;</small></font></label>
                         <input type="text" class="remove-bottom half-width pull-center" id="Minterms" placeholder="Nhập các minterms" value="0,1,2,5,6,7,8,9,10,14" style="font-style: italic;">
                         <br>
                         <br>
                        <p class="header-color half-bottom">
                            <small>
                                Nhập các <b> Minterms </b> dưới dạng thập phân và cách nhau bằng <b>1 dấu phẩy</b> rồi nhấn <b>Enter</b> (Vd: <b>0,1,5,7,8,10,14,15</b>)
                            </small>
                        </p>
                    </div>
                    
                    <div class="eight columns add-bottom" style="display: block">
                        <input type="text" class="remove-bottom full-width pull-center" id="equation" placeholder="Nhập đa thức dưới dạng nối rời chính tắc" style="font-style: italic;">
                        <p class="header-color half-bottom">
                            <br>
                            <small>
                                Lưu ý: Có thể dùng dấu <b>!</b> để biểu diễn <b>NOT</b> và dấu <b>+</b> cho <b>OR</b> (Vd: <b>XYZT + !XY!Z + X!YT</b>)
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
                         <input id="clickSimplify" type="button" class="button" value="Simplify" onClick="main();" />
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