<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Illuminate\Http\Request;

class ContactUsController extends BaseController
{
    protected $model = ContactUs::class;
    protected $viewName = "contactus";

    public function index(Request $request)
    {
        $models = $this->model::all();

        return view("admin.{$this->viewName}.index", [
            'models' => $models,
            'viewName' => $this->viewName
        ]);
    }

    public function store(Request $request){
        $contact = new ContactUs;
        $contact->name = $request->sendername;
        $contact->email = $request->emailaddress;
        $contact->subject = $request->sendersubject;
        $contact->message = $request->sendermessage;
        $contact->save();
        return redirect("/contact-us#contact-area")->with(['success' => 'Thanks for your message']);
    }
}
