<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Models\User;
use Carbon\Carbon;
use App\Notifications\AppointmentWhatsapp;
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

$router->get('/', function () use ($router) {try {
	$datas = \App\Models\Appointment::whereDate('appointment_date', Carbon::tomorrow())->get();
		foreach($datas as $data){
			$setting =  \App\Models\Setting::where('clinic_id', $data->clinic_id)->get();
			foreach ($setting as $clinic) {
				\Notification::route('whatsapp', 'WHATSAPP_SESSION')->notify(new AppointmentWhatsapp($data->patient->name,
				$data->appointment_date, $data->description,$data->patient->phone,
				$clinic->name, $clinic->address, $clinic->phone));
			}
		}
	$message = 'Messages Appointment Sended!';
	return $message;
	} catch (\Throwable $th) {
	return $th->getMessage();
	}
});

// Email Verification
$router->get('/v1/auth/email/verification', ['as' => 'email.verification', 'uses' => 'AuthController@verification_email']);
$router->post('/v1/auth/email/send/forgot-password', ['as' => 'email.forgotpassword', 'uses' => 'AuthController@send_forgot_password']);
$router->post('/v1/auth/registration', 'AuthController@registration');
$router->post('/v1/auth/register', 'AuthController@register');
$router->post('/v1/auth/login', 'AuthController@login');
$router->post('/v1/auth/change-password', ['as' => 'email.changepassword', 'uses' => 'AuthController@change_password']);
// $router->post('/v1/auth/send/email', 'AuthController@send_email');

// Address
$router->get('/v1/location/provinces', 'AddressController@index');
$router->get('/v1/location/province/cities/{id}', 'AddressController@cities');
$router->get('/v1/location/province/city/districts/{id}', 'AddressController@districts');
$router->get('/v1/location/province/city/district/villages/{id}', 'AddressController@villages');

$router->group(['middleware' => 'auth'], function () use ($router) {
	// Whatsapp Verification
	$router->post('/v1/auth/send/otp','AuthController@send_otp');
	$router->post('/v1/auth/phone/verification', 'AuthController@verification_otp');
	$router->post('/v1/auth/logout', 'AuthController@logout');

	// SETTING
	$router->get('/v1/setting/{clinic}/clinic', 'SettingController@show');
	$router->post('/v1/setting/{id}', 'SettingController@update');
	// RECIPIENT MAIL SETTING
	$router->get('/v1/recipient-mails', 'RecipientMailController@index');
	$router->post('/v1/recipient-mail', 'RecipientMailController@store');
	$router->delete('/v1/recipient-mail/{id}', 'RecipientMailController@destroy');
	// STATUS MAIL SETTING
	$router->put('/v1/recipient-mail/setting', 'UserController@setStatus');
	// $router->group(['middleware' => 'access'], function () use ($router){

	// ADMIN
	$router->get('/v1/users', 'UserController@index');
	$router->get('/v1/user/{id}', 'UserController@show');
	$router->post('/v1/user', 'UserController@create');
	$router->put('/v1/user/{id}', 'UserController@update');
	$router->delete('/v1/user/{id}', 'UserController@destroy');

	$router->get('/v1/user-clients/{perPage}', 'UserController@getClient');
	$router->get('/v1/user-clients/{perPage}/{keyword}', 'UserController@getClient');

	$router->get('/v1/user-slots', 'UserSlotController@index');
	$router->get('/v1/user-slots/{id}/clinic', 'UserSlotController@getByClinicId');
	$router->get('/v1/user-slot/{id}', 'UserSlotController@show');
	$router->post('/v1/user-slot/add', 'UserSlotController@addSlot');
	$router->post('/v1/user-slot/{id}', 'UserSlotController@create');
	$router->put('/v1/user-slot/{id}', 'UserSlotController@update');
	$router->delete('/v1/user-slot/{id}', 'UserSlotController@destroy');
	
	$router->get('/v1/accesses/{clinic}', 'AccessController@index');
	$router->get('/v1/access/{role}/role', 'AccessController@getByRole');
	$router->post('/v1/access', 'AccessController@create');
	$router->put('/v1/access/{id}', 'AccessController@update');
	$router->delete('/v1/access/{id}', 'AccessController@destroy');

	$router->get('/v1/clinics', 'ClinicController@index');
	$router->get('/v1/clinic/{id}/apdoc', 'ClinicController@getByApdocId');
	$router->get('/v1/clinic/{id}', 'ClinicController@show');
	$router->post('/v1/clinic', 'ClinicController@create');
	$router->put('/v1/clinic/{id}', 'ClinicController@update');
	$router->put('/v1/clinic/{id}/status', 'ClinicController@updateStatus');
	$router->delete('/v1/clinic/{id}', 'ClinicController@destroy');

	$router->get('/v1/positions/{clinic}/{perPage}', 'PositionController@index');
	$router->get('/v1/positions/{clinic}/{perPage}/{keyword}', 'PositionController@index');
	$router->get('/v1/position/{id}', 'PositionController@show');
	$router->post('/v1/position', 'PositionController@create');
	$router->put('/v1/position/{id}', 'PositionController@update');
	$router->delete('/v1/position/{id}', 'PositionController@destroy');

	$router->get('/v1/employees/{clinic}/{perPage}', 'EmployeeController@index');
	$router->get('/v1/employees/{clinic}/{perPage}/{keyword}', 'EmployeeController@index');
	$router->get('/v1/employee/{id}', 'EmployeeController@show');
	$router->post('/v1/employee', 'EmployeeController@create');
	$router->put('/v1/employee/{id}', 'EmployeeController@update');
	$router->delete('/v1/employee/{id}', 'EmployeeController@destroy');

	$router->get('/v1/services/{clinic}/{perPage}', 'ServiceController@index');
	$router->get('/v1/services/{clinic}/{perPage}/{keyword}', 'ServiceController@index');
	$router->get('/v1/service/{id}', 'ServiceController@show');
	$router->post('/v1/service', 'ServiceController@create');
	$router->put('/v1/service/{id}', 'ServiceController@update');
	$router->delete('/v1/service/{id}', 'ServiceController@destroy');

	$router->get('/v1/diagnoses/{perPage}', 'DiagnoseController@index');
	$router->get('/v1/diagnoses/{perPage}/{keyword}', 'DiagnoseController@index');
	$router->get('/v1/diagnose/{id}', 'DiagnoseController@show');
	$router->post('/v1/diagnose', 'DiagnoseController@create');
	$router->put('/v1/diagnose/{id}', 'DiagnoseController@update');
	$router->delete('/v1/diagnose/{id}', 'DiagnoseController@destroy');

	$router->get('/v1/category-payments/{clinic}/{perPage}', 'CategoryPaymentController@index');
	$router->get('/v1/category-payments/{clinic}/{perPage}/{keyword}', 'CategoryPaymentController@index');
	$router->get('/v1/category-payment/{id}', 'CategoryPaymentController@show');
	$router->post('/v1/category-payment', 'CategoryPaymentController@create');
	$router->put('/v1/category-payment/{id}', 'CategoryPaymentController@update');
	$router->delete('/v1/category-payment/{id}', 'CategoryPaymentController@destroy');

	$router->get('/v1/payments/{clinic}/{perPage}', 'PaymentController@index');
	$router->get('/v1/payments/{clinic}/{perPage}/{keyword}', 'PaymentController@index');
	$router->get('/v1/payment/{id}', 'PaymentController@show');
	$router->post('/v1/payment', 'PaymentController@create');
	$router->put('/v1/payment/{id}', 'PaymentController@update');
	$router->delete('/v1/payment/{id}', 'PaymentController@destroy');

	$router->get('/v1/category-outcomes/{clinic}/{perPage}', 'CategoryOutcomeController@index');
	$router->get('/v1/category-outcomes/{clinic}/{perPage}/{keyword}', 'CategoryOutcomeController@index');
	$router->get('/v1/category-outcome/{id}', 'CategoryOutcomeController@show');
	$router->post('/v1/category-outcome', 'CategoryOutcomeController@create');
	$router->put('/v1/category-outcome/{id}', 'CategoryOutcomeController@update');
	$router->delete('/v1/category-outcome/{id}', 'CategoryOutcomeController@destroy');

	$router->get('/v1/outcomes/{clinic}/{perPage}', 'OutcomeController@index');
	$router->get('/v1/outcomes/{clinic}/{perPage}/{keyword}', 'OutcomeController@index');
	$router->get('/v1/outcome/{id}', 'OutcomeController@show');
	$router->post('/v1/outcome', 'OutcomeController@create');
	$router->put('/v1/outcome/{id}', 'OutcomeController@update');
	$router->delete('/v1/outcome/{id}', 'OutcomeController@destroy');

	$router->get('/v1/promotions/{clinic}/{perPage}', 'PromotionController@index');
	$router->get('/v1/promotions/{clinic}/{perPage}/{keyword}', 'PromotionController@index');
	$router->get('/v1/promotion/{id}', 'PromotionController@show');
	$router->post('/v1/promotion', 'PromotionController@create');
	$router->put('/v1/promotion/{id}', 'PromotionController@update');
	$router->delete('/v1/promotion/{id}', 'PromotionController@destroy');
	$router->post('/v1/stock-adjustment', 'StockAdjustmentController@create');

	// RECEPTIONIST
	$router->get('/v1/patients/{clinic}/{perPage}', 'PatientController@index');
	$router->get('/v1/patients/{clinic}/{perPage}/{keyword}', 'PatientController@index');
	$router->get('/v1/patient/{id}', 'PatientController@show');
	$router->post('/v1/patient', 'PatientController@create');
	$router->put('/v1/patient/{id}', 'PatientController@update');
	$router->delete('/v1/patient/{id}', 'PatientController@destroy');
	
	$router->get('/v1/appointments/{clinic}/{perPage}', 'AppointmentController@index');
	$router->get('/v1/appointments/{clinic}/{perPage}/{keyword}', 'AppointmentController@index');
	$router->get('/v1/appointment/{id}', 'AppointmentController@show');
	$router->put('/v1/appointment/{id}', 'AppointmentController@store');
	$router->post('/v1/appointment', 'AppointmentController@store');
	$router->delete('/v1/appointment/{id}','AppointmentController@destroy');

	$router->get('/v1/queues/{clinic}', 'QueueController@index');
	$router->post('/v1/queue/{appointment}/appointment', 'QueueController@createFromAppointment');
	$router->post('/v1/queue/{patient}', 'QueueController@create');
	$router->put('/v1/queue/{id}/{status}', 'QueueController@update');

	$router->get('/v1/queue-details', 'QueueDetailController@index');
	$router->get('/v1/queue-detail', 'QueueDetailController@getByDoctor');
	$router->post('/v1/queue-detail/{queue}/{employee}/{service}', 'QueueDetailController@create');
	$router->put('/v1/queue-detail/{id}', 'QueueDetailController@update');
	
	// DOCTOR
	$router->get('/v1/records/{clinic}/{perPage}', 'RecordController@index');
	$router->get('/v1/records/{clinic}/{perPage}/{keyword}', 'RecordController@index');
	$router->get('/v1/record/{patient}', 'RecordController@show');
	$router->post('/v1/record', 'RecordController@create');
	$router->post('/v1/record/{id}', 'RecordController@update');
	$router->put('/v1/record/{id}/editable', 'RecordController@updateEditable');
	$router->delete('/v1/record/{id}', 'RecordController@destroy');

	$router->post('/v1/record-image/{record}', 'RecordController@addImageRecord');
	$router->delete('/v1/record-image/{id}', 'RecordController@deleteImageRecord');

	$router->get('/v1/growths', 'GrowthController@index');
	$router->get('/v1/growth/latest', 'GrowthController@getLatest');
	$router->get('/v1/growth/{id}', 'GrowthController@show');
	$router->get('/v1/growth/{patient}/patient', 'GrowthController@getByPatient');
	$router->post('/v1/growth', 'GrowthController@create');
	$router->put('/v1/growth/{id}', 'GrowthController@update');
	$router->delete('/v1/growth/{id}', 'GrowthController@destroy');

	// PHARMACY
	$router->get('/v1/category-items/{clinic}/{perPage}', 'CategoryItemController@index');
	$router->get('/v1/category-items/{clinic}/{perPage}/{keyword}', 'CategoryItemController@index');
	$router->get('/v1/category-item/{id}', 'CategoryItemController@show');
	$router->post('/v1/category-item', 'CategoryItemController@create');
	$router->put('/v1/category-item/{id}', 'CategoryItemController@update');
	$router->delete('/v1/category-item/{id}', 'CategoryItemController@destroy');

	$router->get('/v1/items/{clinic}/{perPage}', 'ItemController@index');
	$router->get('/v1/items/{clinic}/{perPage}/{keyword}', 'ItemController@index');
	$router->get('/v1/item/{id}', 'ItemController@show');
	$router->post('/v1/item', 'ItemController@create');
	$router->put('/v1/item/{id}', 'ItemController@update');
	$router->delete('/v1/item/{id}', 'ItemController@destroy');
	
	$router->get('/v1/item-supplys/{clinic}/{perPage}', 'ItemSupplyController@index');
	$router->get('/v1/item-supplys/{clinic}/{perPage}/{keyword}', 'ItemSupplyController@index');
	$router->get('/v1/item-supply/{item}', 'ItemSupplyController@show');
	$router->post('/v1/item-supply', 'ItemSupplyController@create');

	$router->get('/v1/stock-adjustments/{clinic}/{perPage}', 'StockAdjustmentController@index');
	$router->get('/v1/stock-adjustments/{clinic}/{perPage}/{keyword}', 'StockAdjustmentController@index');
	$router->post('/v1/stock-adjustment', 'StockAdjustmentController@create');
	
	// CASHIER	
	$router->get('/v1/transactions/{clinic}/{perPage}', 'TransactionController@index');
	$router->get('/v1/transactions/{clinic}/{perPage}/{keyword}', 'TransactionController@index');
	$router->get('/v1/transaction/{cancelled}/status', 'TransactionController@status');
	$router->get('/v1/transaction/code', 'TransactionController@code');
	$router->post('/v1/transaction', 'TransactionController@create');
	$router->put('/v1/transaction/{id}', 'TransactionController@update');

	//  REPORT
	$router->get('/v1/report-sales/summary/{clinic}/{from}/{to}', 'ReportSalesController@summary');
	$router->get('/v1/report-sales/gross/{clinic}/{from}/{to}', 'ReportSalesController@gross');
	$router->get('/v1/report-sales/payment/{clinic}/{from}/{to}', 'ReportSalesController@payment');
	$router->get('/v1/report-sales/service/{clinic}/{from}/{to}', 'ReportSalesController@service');
	$router->get('/v1/report-sales/item/{clinic}/{from}/{to}', 'ReportSalesController@item');
	$router->get('/v1/report-sales/category/{clinic}/{from}/{to}', 'ReportSalesController@category');
	$router->get('/v1/report-sales/promotion/{clinic}/{from}/{to}', 'ReportSalesController@promotion');
	$router->get('/v1/report-sales/collected/{clinic}/{from}/{to}', 'ReportSalesController@collected');

	// EXCEL
	$router->get('/v1/export/patient', 'ExcelController@exportPatient');
	$router->post('/v1/import/patient', 'ExcelController@importPatient');
	// });
});
