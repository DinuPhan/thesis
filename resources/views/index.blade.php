<!DOCTYPE html> 
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="custom/img/School.ico">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <title>Thesis GUI</title>

    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />

    @section('css')
        {{Html::style('css/app.css')}}
        {{Html::style('custom/css/animate.min.css')}}
        {{Html::style('custom/css/custom-bootstrap-dashboard.css')}}
        {{Html::style('custom/css/pe-icon-7-stroke.css')}}
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,700,300' rel='stylesheet' type='text/css'>
        @yield('extra-style')
    @show

</head>
<body>

<div class="wrapper">
    @include('partials.sidebar')

    <div class="main-panel">
        
        @include('partials.header')


        <div class="content">
            @yield('contents')
        </div>

        @include('partials.footer')

    </div>
</div>


</body>
    
    @section('script')
        {{Html::script('custom/js/jquery-1.10.2.js')}}
        {{Html::script('js/app.js')}}
        {{Html::script('custom/js/bootstrap-checkbox-radio-switch.js')}}
        {{Html::script('custom/js/chartist.min.js')}}
        {{Html::script('custom/js/bootstrap-notify.js')}}
        {{Html::script('custom/js/custom-bootstrap-dashboard.js')}}
        @yield('extra-script')
    @show
</html>
