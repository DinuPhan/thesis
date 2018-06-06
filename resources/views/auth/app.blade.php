<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="light/img/favicon.ico">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <title>Light Bootstrap Dashboard by Creative Tim</title>

    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />

    @section('css')
        {{Html::style('css/app.css')}}
        {{Html::style('light/css/animate.min.css')}}
        {{Html::style('light/pro/light-bootstrap-dashboard.css')}}
        {{Html::style('light/css/demo.css')}}

        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,700,300' rel='stylesheet' type='text/css'>

        {{Html::style('light/css/pe-icon-7-stroke.css')}}

        @yield('extra-style')
    @show

</head>
<body>


@yield('contents')


</body>
    
    @section('script')
        {{Html::script('light/js/jquery-1.10.2.js')}}
        {{Html::script('js/app.js')}}
        {{Html::script('light/js/bootstrap-checkbox-radio-switch.js')}}
        {{Html::script('light/js/chartist.min.js')}}
        {{Html::script('light/js/bootstrap-notify.js')}}
        {{Html::script('light/pro/light-bootstrap-dashboard.js')}}
        {{Html::script('light/js/demo.js')}}

        @yield('extra-script')

        <script type="text/javascript">
        $().ready(function(){
            lbd.checkFullPageBackgroundImage();
            
            setTimeout(function(){
                // after 1000 ms we add the class animated to the login/register card
                $('.card').removeClass('card-hidden');
            }, 700)
        });
    </script>

    @show

</html>
