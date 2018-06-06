<div class="sidebar" data-color="azure" data-image="{{URL::asset('custom/img/sidebar-5.png')}}">

    <!--

        Tip 1: you can change the color of the sidebar using: data-color="blue | azure | green | orange | red | purple"
        Tip 2: you can also add an image using data-image tag

    -->

        <div class="sidebar-wrapper">
            <div class="logo">
                <div class= "simple-text"> Graduation Thesis </div>
            </div>

            <ul class="nav">
                <li>
                    <a href="{{route('home')}}">
                        <i class="pe-7s-home"></i> 
                        <p>Home</p>
                    </a> 
                </li>
                <li>
                    <a class="dropdown">
                        <i class="pe-7s-calculator"></i> 
                        <p>Boolean function Solver</p>
                    </a> 
                    <div class="dropdown-container">
                        <a href="{{route('karnaughsolver')}}">
                            <i class="pe-7s-angle-right"></i>
                            <p>Karnaugh map</p>
                        </a>
                        <a href="{{route('quinemccluskey')}}">
                            <i class="pe-7s-angle-right"></i>
                            <p>Quine Mccluskey</p>
                        </a>
                    </div>
                </li>
                <li>
                    <a class="dropdown">
                        <i class="pe-7s-usb"></i> 
                        <p>Logic Proposition Solver</p>
                    </a> 
                    <div class="dropdown-container">
                        <a href="#">
                            <i class="pe-7s-angle-right"></i>
                            <p>Check an inference</p>
                        </a>
                         <a href="#">
                            <i class="pe-7s-angle-right"></i>
                            <p>Simplify expressions</p>
                        </a>
                    </div>
                </li>
                <li>
                    <a href="{{route('info')}}">
                        <i class="pe-7s-info"></i> 
                        <p>About</p>
                    </a> 
                </li>
            </ul>
        </div>
    </div>