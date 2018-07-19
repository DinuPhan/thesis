@extends('index')
@section('extra-style')
    {{-- {{Html::style('custom/css/quine_mccluskey/quine_mccluskey_style.css')}} --}}
    {{-- {{Html::style('custom/css/resolutionProver/resolution_style.css')}} --}}
    {{Html::style('custom/css/resolutionProver/resolution_style_new.css')}}
    {{Html::style('custom/css/pe-icon-7-stroke.css')}}
@endsection

@section('contents')
    <div class="container">
        <div class="row">
            <div class="col-sm-3 column" id='leftColumn'>
                <p style="font-size:small; margin-top:10px">Nhập các mệnh đề theo <b>chuẩn thông thường</b> hoặc <b>chuẩn ký pháp Ba Lan</b><br>" (p and q) implies r " <=> " CKpqr "</p>
                <table id="inputForm1" class='different'>
                    <tr class='different'>
                        <td class='different'>
                            <input type="text" class='text different' id="inputResPremise" style="float:left" autocapitalize="none" autocorrect="off" autocomplete="off">
                        </td>
                    </tr>
                    <tr>  
                        <td class='different'>
                            <button id="resPremiseAddButton" onclick="submitResPremise()" type="button" class="btn btn-default btn-sm">Thêm giả thiết</button>
                        </td>
                    </tr>                  
                    <tr class='different'>
                        <td class='different'>
                            <input type="text" class='text different' id="inputResConclusion" style="float:left" autocapitalize="none" autocorrect="off" autocomplete="off"> 
                        </td>
                        <td class='different'>
                            <button id="resConclAddButton" onclick="submitResConcl()" type="button" class="btn btn-default btn-sm">Thêm kết luận</button>
                        </td>
                    </tr>
                </table>

                {{-- <br>
                    <button id="resetButton" onclick="resetTableau()" type="button" class="btn btn-default">RESET</button>
                <br> --}}
                <div class="propLists">
                    <h4 class='diff'><b>Giả thiết:</b></h4>
                    <table class="table" id="premiseTable">
                    </table>

                    <h4 class='diff'><b>Kết luận:</b></h4>
                    <table class="table" id="conclusionTable">
                    </table>
                </div>
            </div>
        

    
            <div class="col-sm-8 col-sm-offset-1" id="rightColumn">
                <div>
                    <h3 class="otherDiff"><b>Hiển thị từng bước</b>
                        <i class="tooltip pe-7s-info">
                        <span class="tooltiptext">Tooltip text</span>
                    </i></h3>
                    
                </div>                
                <p id='resultLine'><b>Kết luận: suy luận này là </b></p>
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
    {{Html::script('custom/js/resolutionProver/resolution.js')}}
    {{Html::script('custom/js/resolutionProver/model-table.js')}}
@endsection