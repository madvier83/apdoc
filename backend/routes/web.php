<?php

/** @var \Laravel\Lumen\Routing\Router $router */

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
	return $router->app->version();
});

$router->post('/register', 'AuthController@register');
$router->post('/login', 'AuthController@login');

$router->group(['middleware' => 'auth'], function () use ($router) {
	$router->post('/logout', 'AuthController@logout');

	$router->get('/user', 'UserController@index');
	$router->get('/user/{id}', 'UserController@show');
	$router->post('/user', 'UserController@create');
	$router->put('/user/{id}', 'UserController@update');
	$router->delete('/user/{id}', 'UserController@destroy');

	$router->get('/klinik', 'KlinikController@index');
	$router->get('/klinik/{id}', 'KlinikController@show');
	$router->post('/klinik', 'KlinikController@create');
	$router->put('/klinik/{id}', 'KlinikController@update');
	$router->delete('/klinik/{id}', 'KlinikController@destroy');

	$router->get('/patient', 'PatientController@index');
	$router->get('/patient/{id}', 'PatientController@show');
	$router->post('/patient', 'PatientController@create');
	$router->put('/patient/{id}', 'PatientController@update');
	$router->delete('/patient/{id}', 'PatientController@destroy');
});
