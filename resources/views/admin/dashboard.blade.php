@extends('admin.layout.base')

@section('title', 'Dashboard Admin Legacy Vape Store')

@section('adminContent')
<div class="page-subheader mb-30">
    <div class="container-fluid">
        <div class="row align-items-center">
            <div class="col-md-7">
                <div class="list">
                    <div class="list-item pl-0">
                        <div class="list-thumb ml-0 mr-3 pr-3  b-r text-muted">
                            <i class="icon-Home"></i>
                        </div>
                        <div class="list-body">
                            <div class="list-title fs-2x">
                                <h3>Legacy Vape Store <strong>Dashboard</strong></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-5 d-flex justify-content-end h-md-down">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb no-padding bg-trans mb-0">
                        <li class="breadcrumb-item"><a href="{{url('dashboard')}}"><i class="icon-Home mr-2 fs14"></i></a></li>
                        <li class="breadcrumb-item">Dashboard</li>
                        <li class="breadcrumb-item active">Default </li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
</div><!-- page-sub-Header end-->
<div class="page-content d-flex flex">
    <div class="container-fluid">
        <div class="row">
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="list bg-white shadow-sm rounded mb-30">
                    <div class="list-item">
                        <div class="list-thumb avatar si-colored-facebook text-white rounded avatar60">
                            <i class="icon-User"></i>
                        </div>
                        <div class="list-body text-right">
                            <span class="list-title fs-1x">{{ $users }}</span>
                            <span class="list-content">Total Users
                                            </span>
                        </div>
                    </div>
                </div>
            </div><!--col-->
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="list bg-white shadow-sm rounded mb-30">
                    <div class="list-item">
                        <div class="list-thumb avatar si-colored-facebook text-white rounded avatar60">
                            <i class="icon-Duplicate-Window"></i>
                        </div>
                        <div class="list-body text-right">
                            <span class="list-title fs-1x">{{ $headlines }}</span>
                            <span class="list-content">Total Headlines
                                            </span>
                        </div>
                    </div>
                </div>
            </div><!--col-->
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="list bg-white shadow-sm rounded mb-30">
                    <div class="list-item">
                        <div class="list-thumb avatar si-colored-facebook text-white rounded avatar60">
                            <i class="icon-Shop"></i>
                        </div>
                        <div class="list-body text-right">
                            <span class="list-title fs-1x">{{ $products }}</span>
                            <span class="list-content">Total Products
                                            </span>
                        </div>
                    </div>
                </div>
            </div><!--col-->
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="list bg-white shadow-sm rounded mb-30">
                    <div class="list-item">
                        <div class="list-thumb avatar si-colored-facebook text-white rounded avatar60">
                            <i class="icon-Receipt"></i>
                        </div>
                        <div class="list-body text-right">
                            <span class="list-title fs-1x">{{ $blogs }}</span>
                            <span class="list-content">Total Blogs
                                            </span>
                        </div>
                    </div>
                </div>
            </div><!--col-->
            <div class="col-xl-3 col-lg-4 col-md-6 mb-30">
                <div class="list bg-white shadow-sm rounded">
                    <div class="list-item">
                        <div class="list-thumb avatar si-colored-facebook text-white rounded avatar60">
                            <i class="icon-Mail-Inbox"></i>
                        </div>
                        <div class="list-body text-right">
                            <span class="list-title fs-1x">{{ $contacts }}</span>
                            <span class="list-content">Total Contact
                                            </span>
                        </div>
                    </div>
                </div>
            </div><!--col-->
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="list bg-white shadow-sm rounded mb-30">
                    <div class="list-item">
                        <div class="list-thumb avatar si-colored-facebook text-white rounded avatar60">
                            <i class="icon-Settings-Window"></i>
                        </div>
                        <div class="list-body text-right">
                            <span class="list-title fs-1x">{{ $settings }}</span>
                            <span class="list-content">Total Settings
                                            </span>
                        </div>
                    </div>
                </div>
            </div><!--col-->
        </div>
    </div>
</div>
@endsection