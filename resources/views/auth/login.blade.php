@extends('auth.app')

@section('contents')
<nav class="navbar navbar-transparent navbar-absolute">
    <div class="container">    
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="{{route('dashboard')}}">Light Bootstrap Dashboard</a>
        </div>
        <div class="collapse navbar-collapse">       
            
            <ul class="nav navbar-nav navbar-right">
                <li>
                   <a href="{{route('register')}}">
                        Register
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
    <div class="wrapper wrapper-full-page">
    <div class="full-page login-page" data-color="purple" data-image="{{URL::asset('light/img/full-screen-image-1.jpg')}}">   
        
    <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
            <div class="container">
                <div class="row">                   
                    <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                        <form role="form" method="POST" action="{{ route('login') }}">
                            {{ csrf_field() }}
                            <div class="card card-hidden">
                                <div class="header text-center">Login</div>
                                <div class="content">
                                    <div class="form-group {{ $errors->has('email') ? ' has-error' : '' }}">
                                        <label>Email address</label>
                                        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus>
                                        @if ($errors->has('email'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('email') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                    <div class="form-group {{ $errors->has('password') ? ' has-error' : '' }}">
                                        <label>Password</label>
                                        <input id="password" type="password" class="form-control" name="password" required>
                                        @if ($errors->has('password'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('password') }}</strong>
                                            </span>
                                        @endif
                                    </div>                                    
                                    <div class="form-group">
                                        <label class="checkbox">
                                            <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}>
                                            Remember Me
                                        </label>

                                    </div>
                                </div>
                                <div class="footer text-center">
                                    <button type="submit" class="btn btn-fill btn-warning btn-wd">Login</button><br>
                                    <a href="{{ route('password.request') }}">I forgot my password</a>    
                                </div>
                            </div>
                                
                        </form>
                                
                    </div>                    
                </div>
            </div>
        </div>
    
    </div>                             
       
</div>
@endsection
