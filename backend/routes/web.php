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
	return "AppDoc API v1.0";
});

// Email Verification
$router->get('/v1/auth/email/verification', ['as' => 'email.verification', 'uses' => 'AuthController@verification_email']);
$router->post('/v1/auth/email/send/forgot-password', ['as' => 'email.forgotpassword', 'uses' => 'AuthController@send_forgot_password']);
$router->post('/v1/auth/register', 'AuthController@register');
$router->post('/v1/auth/login', 'AuthController@login');

// Whatsapp Verification
$router->post('/v1/auth/send/otp','AuthController@send_otp');
$router->post('/v1/auth/change-password', ['as' => 'email.changepassword', 'uses' => 'AuthController@change_password']);
$router->post('/v1/auth/phone/verification', 'AuthController@verification_otp');

$router->group(['middleware' => 'auth'], function () use ($router) {

	// send email verification
	$router->post('/v1/auth/send/email', 'AuthController@send_email');
	$router->post('/v1/auth/logout', 'AuthController@logout');

	// ADMIN
	$router->get('/v1/users', 'UserController@index');
	$router->get('/v1/user/{id}', 'UserController@show');
	$router->post('/v1/user', 'UserController@create');
	$router->put('/v1/user/{id}', 'UserController@update');
	$router->delete('/v1/user/{id}', 'UserController@destroy');

	$router->get('/v1/clinics', 'ClinicController@index');
	$router->get('/v1/clinic/{id}', 'ClinicController@show');
	$router->post('/v1/clinic', 'ClinicController@create');
	$router->put('/v1/clinic/{id}', 'ClinicController@update');
	$router->delete('/v1/clinic/{id}', 'ClinicController@destroy');

	$router->get('/v1/positions', 'PositionController@index');
	$router->get('/v1/position/{id}', 'PositionController@show');
	$router->post('/v1/position', 'PositionController@create');
	$router->put('/v1/position/{id}', 'PositionController@update');
	$router->delete('/v1/position/{id}', 'PositionController@destroy');

	$router->get('/v1/employees', 'EmployeeController@index');
	$router->get('/v1/employee/{id}', 'EmployeeController@show');
	$router->post('/v1/employee', 'EmployeeController@create');
	$router->put('/v1/employee/{id}', 'EmployeeController@update');
	$router->delete('/v1/employee/{id}', 'EmployeeController@destroy');

	$router->get('/v1/diagnoses', 'DiagnoseController@index');
	$router->get('/v1/diagnose/{id}', 'DiagnoseController@show');
	$router->post('/v1/diagnose', 'DiagnoseController@create');
	$router->put('/v1/diagnose/{id}', 'DiagnoseController@update');
	$router->delete('/v1/diagnose/{id}', 'DiagnoseController@destroy');

	$router->get('/v1/services', 'ServiceController@index');
	$router->get('/v1/service/{id}', 'ServiceController@show');
	$router->post('/v1/service', 'ServiceController@create');
	$router->put('/v1/service/{id}', 'ServiceController@update');
	$router->delete('/v1/service/{id}', 'ServiceController@destroy');

	$router->get('/v1/category-payments', 'CategoryPaymentController@index');
	$router->get('/v1/category-payment/{id}', 'CategoryPaymentController@show');
	$router->post('/v1/category-payment', 'CategoryPaymentController@create');
	$router->put('/v1/category-payment/{id}', 'CategoryPaymentController@update');
	$router->delete('/v1/category-payment/{id}', 'CategoryPaymentController@destroy');

	$router->get('/v1/payments', 'PaymentController@index');
	$router->get('/v1/payment/{id}', 'PaymentController@show');
	$router->post('/v1/payment', 'PaymentController@create');
	$router->put('/v1/payment/{id}', 'PaymentController@update');
	$router->delete('/v1/payment/{id}', 'PaymentController@destroy');

	$router->get('/v1/category-outcomes', 'CategoryOutcomeController@index');
	$router->get('/v1/category-outcome/{id}', 'CategoryOutcomeController@show');
	$router->post('/v1/category-outcome', 'CategoryOutcomeController@create');
	$router->put('/v1/category-outcome/{id}', 'CategoryOutcomeController@update');
	$router->delete('/v1/category-outcome/{id}', 'CategoryOutcomeController@destroy');

	$router->get('/v1/outcomes', 'OutcomeController@index');
	$router->get('/v1/outcome/{id}', 'OutcomeController@show');
	$router->post('/v1/outcome', 'OutcomeController@create');
	$router->put('/v1/outcome/{id}', 'OutcomeController@update');
	$router->delete('/v1/outcome/{id}', 'OutcomeController@destroy');

	// RECEPTIONIST

	$router->get('/v1/appointments', 'AppointmentController@index');
	$router->get('/v1/appointment/{id}', 'AppointmentController@index');
	$router->put('/v1/appointment/{id}', 'AppointmentController@store');
	$router->post('/v1/appointment', 'AppointmentController@store');
	$router->delete('/v1/appointment/{id}','AppointmentController@destroy');

	$router->get('/v1/patients', 'PatientController@index');
	$router->get('/v1/patient/{id}', 'PatientController@show');
	$router->post('/v1/patient', 'PatientController@create');
	$router->put('/v1/patient/{id}', 'PatientController@update');
	$router->delete('/v1/patient/{id}', 'PatientController@destroy');

	$router->get('/v1/queues', 'QueueController@index');
	$router->post('/v1/queue/{patient}', 'QueueController@create');
	$router->put('/v1/queue/{id}/{status}', 'QueueController@update');

	$router->get('/v1/queue-details', 'QueueDetailController@index');
	$router->post('/v1/queue-detail/{queue}/{employee}/{service}', 'QueueDetailController@create');
	$router->put('/v1/queue-detail/{id}', 'QueueDetailController@update');

	// PHARMACY
	
	$router->get('/v1/category-items', 'CategoryItemController@index');
	$router->get('/v1/category-item/{id}', 'CategoryItemController@show');
	$router->post('/v1/category-item', 'CategoryItemController@create');
	$router->put('/v1/category-item/{id}', 'CategoryItemController@update');
	$router->delete('/v1/category-item/{id}', 'CategoryItemController@destroy');

	$router->get('/v1/items', 'ItemController@index');
	$router->get('/v1/item/{id}', 'ItemController@show');
	$router->post('/v1/item', 'ItemController@create');
	$router->put('/v1/item/{id}', 'ItemController@update');
	$router->delete('/v1/item/{id}', 'ItemController@destroy');
	
	$router->get('/v1/item-supplys', 'ItemSupplyController@index');
	$router->get('/v1/item-supply/{item}', 'ItemSupplyController@show');
	$router->post('/v1/item-supply', 'ItemSupplyController@create');

	$router->get('/v1/stock-adjustments', 'StockAdjustmentController@index');
	$router->post('/v1/stock-adjustment', 'StockAdjustmentController@create');
	
	// PROMOTION
	
	$router->get('/v1/promotions', 'PromotionController@index');
	$router->get('/v1/promotion/{id}', 'PromotionController@show');
	$router->post('/v1/promotion', 'PromotionController@create');
	$router->put('/v1/promotion/{id}', 'PromotionController@update');
	$router->delete('/v1/promotion/{id}', 'PromotionController@destroy');
	$router->post('/v1/stock-adjustment', 'StockAdjustmentController@create');
	
	// CASHIER
	
	$router->get('/v1/transactions', 'TransactionController@index');
	$router->post('/v1/transaction', 'TransactionController@create');
	$router->put('/v1/transaction/{id}', 'TransactionController@update');

	// SETTING
	
	$router->get('/v1/setting/{id}', 'SettingController@show');
	$router->post('/v1/setting', 'SettingController@create');
	
});
