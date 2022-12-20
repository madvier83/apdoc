<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Models\User;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
	// return $router->app->version();
	// return User::where('id', 1)->first();
	return User::where('id', 1)->with(['employee', 'employees'])->first();
});

$router->post('/register', 'AuthController@register');
$router->post('/login', 'AuthController@login');

$router->group(['middleware' => 'auth'], function () use ($router) {
	$router->post('/logout', 'AuthController@logout');

	// ADMIN

	$router->get('/user', 'UserController@index');
	$router->get('/user/{id}', 'UserController@show');
	$router->post('/user', 'UserController@create');
	$router->put('/user/{id}', 'UserController@update');
	$router->delete('/user/{id}', 'UserController@destroy');

	$router->get('/clinic', 'ClinicController@index');
	$router->get('/clinic/{id}', 'ClinicController@show');
	$router->post('/clinic', 'ClinicController@create');
	$router->put('/clinic/{id}', 'ClinicController@update');
	$router->delete('/clinic/{id}', 'ClinicController@destroy');

	$router->get('/patient', 'PatientController@index');
	$router->get('/patient/{id}', 'PatientController@show');
	$router->post('/patient', 'PatientController@create');
	$router->put('/patient/{id}', 'PatientController@update');
	$router->delete('/patient/{id}', 'PatientController@destroy');

	$router->get('/position', 'PositionController@index');
	$router->get('/position/{id}', 'PositionController@show');
	$router->post('/position', 'PositionController@create');
	$router->put('/position/{id}', 'PositionController@update');
	$router->delete('/position/{id}', 'PositionController@destroy');

	$router->get('/employee', 'EmployeeController@index');
	$router->get('/employee/{id}', 'EmployeeController@show');
	$router->post('/employee', 'EmployeeController@create');
	$router->put('/employee/{id}', 'EmployeeController@update');
	$router->delete('/employee/{id}', 'EmployeeController@destroy');

	$router->get('/diagnose', 'DiagnoseController@index');
	$router->get('/diagnose/{id}', 'DiagnoseController@show');
	$router->post('/diagnose', 'DiagnoseController@create');
	$router->put('/diagnose/{id}', 'DiagnoseController@update');
	$router->delete('/diagnose/{id}', 'DiagnoseController@destroy');

	$router->get('/service', 'ServiceController@index');
	$router->get('/service/{id}', 'ServiceController@show');
	$router->post('/service', 'ServiceController@create');
	$router->put('/service/{id}', 'ServiceController@update');
	$router->delete('/service/{id}', 'ServiceController@destroy');
});
