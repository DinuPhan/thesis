<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QuineMccluskeyController extends Controller
{
    public function index(){
    	return view('layouts.quinemccluskey.index');
    }
}
