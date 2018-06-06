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
                    <div class="col-md-6 col-sm-8 col-md-offset-3 col-sm-offset-1">
                        <div class="card card-hidden">
                                <div class="header text-center">Reset Password</div>
                                <div class="content">
                                    <form class="form-horizontal" role="form" method="POST" action="{{ route('password.email') }}">
                                            {{ csrf_field() }}

                                            @if (session('status'))
                                                <div class="alert alert-success">
                                                    {{ session('status') }}
                                                </div>
                                            @endif

                                            <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                                                <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                                                <div class="col-md-6">
                                                    <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required>

                                                    @if ($errors->has('email'))
                                                        <span class="help-block">
                                                            <strong>{{ $errors->first('email') }}</strong>
                                                        </span>
                                                    @endif
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="col-md-6 col-md-offset-4">
                                                    <button type="submit" class="btn btn-primary">
                                                        Send Password Reset Link
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
