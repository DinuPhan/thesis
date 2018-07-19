<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ResolutionProverController extends Controller
{
    public function index(){
    	return view('layouts.resolutionprover.index');
    }
}
