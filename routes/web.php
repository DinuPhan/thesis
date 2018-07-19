<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::Auth();

//can change quest to auth if needed
Route::group(['middleware' => 'guest'], function () {
	Route::get('/', ['as' => 'home','uses' => 'HomeController@index']);
	Route::get('/home',['as'=>'home','uses'=>'HomeController@index']);
	Route::get('/karnaughsolver',['as'=>'karnaughsolver','uses'=>'KarnaughSolverController@index']);
	Route::get('/quinemccluskey',['as'=>'quinemccluskey','uses'=>'QuineMccluskeyController@index']);
	Route::get('/resolutionProver',['as'=>'resolutionProver','uses'=>'ResolutionProverController@index']);
	Route::get('/simplifyExpression',['as'=>'simplifyExpression','uses'=>'SimplifyExpressionController@index']);
	Route::get('/info',['as'=>'info','uses'=>'InfoController@index']);
});
