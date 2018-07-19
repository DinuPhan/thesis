<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SimplifyExpressionController extends Controller
{
    public function index(){
    	return view('layouts.simplifyexpression.index');
    }
}
