<div class="sidebar" data-color="azure" data-image="{{URL::asset('custom/img/sidebar-5.png')}}">

    <!--

        Tip 1: you can change the color of the sidebar using: data-color="blue | azure | green | orange | red | purple"
        Tip 2: you can also add an image using data-image tag

    -->

        <div class="sidebar-wrapper">
            <div class="logo">
                <div class= "simple-image-logo">
                    <img class= "img-responsive" src="https://image.ibb.co/ikfnny/boolo.png">
                </div>
            </div>

            <ul class="nav">
                <li>
                    <a href="{{route('home')}}">
                        <i class="pe-7s-home"></i> 
                        <p>Trang chủ</p>
                    </a> 
                </li>


                <li>
                    <a class="dropdown">
                        <i class="pe-7s-calculator"></i> 
                        <p>Công thức đa thức tối tiểu</p>
                    </a> 
                    <div class="dropdown-container">
                        <a href="{{route('karnaughsolver')}}">
                            <i class="pe-7s-angle-right"></i>
                            <p>PP biểu đồ Karnaugh</p>
                        </a>
                        <a href="{{route('quinemccluskey')}}">
                            <i class="pe-7s-angle-right"></i>
                            <p>PP Quine Mccluskey</p>
                        </a>
                    </div>
                </li>
                <li>
                    <a class="dropdown">
                        <i class="pe-7s-usb"></i> 
                        <p>Biểu thức logic</p>
                    </a> 
                    <div class="dropdown-container">
                        <a href="#">
                            <i class="pe-7s-angle-right"></i>
                            <p>Kiểm tra suy luận</p>
                        </a>
                         <a href="#">
                            <i class="pe-7s-angle-right"></i>
                            <p>Rút gọn biểu thức</p>
                        </a>
                    </div>
                </li>


            {{--     <li>
                    <a href="{{route('karnaughsolver')}}">
                        <i class="pe-7s-calculator"></i> 
                        <p>Rút gọn PP bìa Karnaugh</p>
                    </a> 
                </li>

                <li>
                    <a href="{{route('quinemccluskey')}}">
                        <i class="pe-7s-usb"></i> 
                        <p>Rút gọn PP Quine-McCluskey</p>
                    </a> 
                </li>
 --}}
                <li>
                    <a href="{{route('info')}}">
                        <i class="pe-7s-info"></i> 
                        <p>Thông tin</p>
                    </a> 
                </li>
            </ul>
        </div>
    </div>