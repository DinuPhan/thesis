@extends('index')
@section('extra-style')
    {{Html::style('custom/css/simplifyExpression/simplifyExpression_style.css')}}
    {{Html::style('custom/css/pe-icon-7-stroke.css')}}
@endsection

@section('contents')
    <div class="container">
        <div class="row">
            <div class="col-sm-3 column" id='leftColumn'>
                <p style="font-size:small; margin-top:10px">Nhập biểu thức logic cần rút gọn theo <b>chuẩn thông thường</b> hoặc <b>chuẩn ký pháp Ba Lan</b>.<br>"(p and q) implies r" <=> "CKpqr"</p>
                <table id="inputForm1" class='different'>
                    <tr class='different'>
                        <td class='different'>
                            <input type="text" class='text different' id="inputExpression" style="float:left" autocapitalize="none" autocorrect="off" autocomplete="off" value="AKabKNaNc">
                        </td>  
                        <td class='different'>
                            <button id="expressionAddButton" onclick="submitExpression()" type="button" class="btn btn-default btn-sm">Rút gọn</button>
                        </td>
                    </tr>                  
                    {{-- <tr class='different'>
                        <td class='different'>
                            <input type="text" class='text different' id="inputResConclusion" style="float:left" autocapitalize="none" autocorrect="off" autocomplete="off"> </td><td class='different'>
                            <button id="resConclAddButton" onclick="submitResConcl()" type="button" class="btn btn-default btn-sm">Enter Conclusion</button>
                        </td>
                    </tr> --}}
                </table>

                {{-- <br>
                    <button id="resetButton" onclick="resetTableau()" type="button" class="btn btn-default">RESET</button>
                <br> --}}
                <div class="propLists">
                    <h4 class='diff'><b>Biểu thức ban đầu:</b></h4>
                    <table class="table" id="premiseTable">
                    </table>
{{-- 
                    <h3 class='diff'><b>CONCLUSIONS</b></h3>
                    <table class="table" id="conclusionTable">
                    </table> --}}
                </div>
            </div>
        

    
            <div class="col-sm-8 col-sm-offset-1" id="rightColumn">
                <h3 class='otherDiff'><b>Hiển thị từng bước</b></h3>
                {{-- <p id='resultLine'><b>The argument is: </b></p> --}}
                <div class='mainTableau' id="tableauContainer">
                    <div id='resolutionDiv'>
                        <table id='masterResTable'>
                            <tr id="mrT">
                                <td id="resTableTD">
                                    <table id='resTable'>
                                    </table>
                                </td>
                                <td id="noteTableTD"><br>
                                    <table id="noteTable">
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>


            
        </div>
    </div>
@endsection


@section('extra-script')
    {{Html::script('custom/js/simplifyExpression/reduction.js')}}
    {{Html::script('custom/js/simplifyExpression/util_scripts.js')}}
@endsection