@extends('index')
@section('extra-style')
    {{Html::style('custom/css/quine_mccluskey/quine_mccluskey_style.css')}}
@endsection

@section('contents')
	<div class="container">
        <div class="jumbotron">
            <form id="Form">

                <div class="form-group">

                    <div class="row">
                        <div class="col-xs-1 col-sm-1 col-md-1 col-lg-2">
                            <label for="Input"><font size=5>F = Σ<small>m</small></font></label>
                        </div>
                        <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                            <input type="text" class="form-control" id="Minterms" placeholder="Enter numbers of minterms like: 2,5,..">
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

                <!-- <div class="row">
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">

                        <ul class="list-group">
                            <li class="list-unstyled">File should contain two lines each are a set of comma seperated integers</li>
                            <li class="list-unstyled">first line should contain minterms and the second should contain dont cares</li>
                        </ul>
                    </div>

                    <div id="downloadButton">

                    </div>
                </div>
 -->
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