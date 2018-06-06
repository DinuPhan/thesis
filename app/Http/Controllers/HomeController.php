<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
	var $pageName = "Home";
    public function index(){
    	return view('layouts.home.index',['pageName','$pageName']);
    }
}
