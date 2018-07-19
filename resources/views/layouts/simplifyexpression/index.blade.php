@extends('index')
@section('extra-style')
    {{Html::style('custom/css/quine_mccluskey/quine_mccluskey_style.css')}}
    {{-- {{Html::style('custom/css/resolutionProver/resolution_style.css')}} --}}
@endsection

@section('contents')
    <div class="container">
        <div class="row">
            <div class="col-sm-3 column" id='leftColumn'>
                <p style="font-size:small; margin-top:10px">Enter propositions in standard or Polish notation.<br>"If (p and q) then r" <=> "CKpqr"</p>
                <table id="inputForm1" class='different'>
                    <tr class='different'>
                        <td class='different'>
                            <input type="text" class='text different' id="inputResPremise" style="float:left" autocapitalize="none" autocorrect="off" autocomplete="off">
                        </td>  
                        <td class='different'>
                            <button id="resPremiseAddButton" onclick="submitResPremise()" type="button" class="btn btn-default btn-sm">Add Premise</button>
                        </td>
                    </tr>                  
                    <tr class='different'>
                        <td class='different'>
                            <input type="text" class='text different' id="inputResConclusion" style="float:left" autocapitalize="none" autocorrect="off" autocomplete="off"> </td><td class='different'>
                            <button id="resConclAddButton" onclick="submitResConcl()" type="button" class="btn btn-default btn-sm">Enter Conclusion</button>
                        </td>
                    </tr>
                </table>

                <br>
                    <button id="resetButton" onclick="resetTableau()" type="button" class="btn btn-default">RESET</button>
                <br>
                <div class="propLists">
                    <h3 class='diff'><b>PREMISES</b></h3>
                    <table class="table" id="premiseTable">
                    </table>

                    <h3 class='diff'><b>CONCLUSIONS</b></h3>
                    <table class="table" id="conclusionTable">
                    </table>
                </div>
            </div>
        

    
            <div class="col-sm-8 col-sm-offset-1" id="rightColumn">
                <h1 class='otherDiff'><b>PROOF</b></h1>
                <p id='resultLine'><b>The argument is: </b></p>
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