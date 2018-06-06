<?php

namespace App\Http\Controllers;
use Illuminate\Html\HtmlFacade;

class IndexController extends Controller {
	
    public function index()
    {
        return view('layouts.dashboard.index');
    }
}
