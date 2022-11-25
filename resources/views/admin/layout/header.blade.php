<header class="navbar page-header whiteHeader navbar-expand-lg">
    <ul class="nav flex-row mr-auto">
        <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link sidenav-btn h-lg-down">
                <span class="navbar-toggler-icon"></span>
            </a>
            <a class="nav-link sidenav-btn h-lg-up" href="#page-aside"  data-toggle="dropdown" data-target="#page-aside">
                <span class="navbar-toggler-icon"></span>
            </a>
        </li>
    </ul>
    <ul class="nav flex-row order-lg-2 ml-auto nav-icons">
        <li class="nav-item dropdown user-dropdown align-items-center">
            <a class="nav-link" href="#" id="dropdown-user" role="button" data-toggle="dropdown">
                <span class="user-states states-online">
                    <img src="images/avatar6.jpg" width="35" alt="" class=" img-fluid rounded-circle">
                </span>
                <span class="ml-2 h-lg-down dropdown-toggle">Hi, {{ Auth::user()->name }}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-user">
                <a class="dropdown-item" href="{{ route('admin.profile',['id'=>Auth::user()->id]) }}"><i class="icon-User">
                </i>My Profile</a>
                <a class="dropdown-item" href="{{ route('logout')}}"><i class="icon-Power"></i>Log Out</a>
            </div>
        </li>
        <li class="h-lg-up nav-item">
            <a href="#" class=" nav-link collapsed" data-toggle="collapse" data-target="#navbarToggler" aria-expanded="false">
                <i class="icon-Magnifi-Glass2"></i>
            </a>
        </li>
    </ul>
    <div class="collapse navbar-collapse search-collapse" id="navbarToggler">
        <form class="form-inline ml-1">
            <button class="no-padding bg-trans border0" type="button"><i class="icon-Magnifi-Glass2"></i></button>
            <input class="form-control border0" type="search" placeholder="Search..." aria-label="Search">
        </form>
    </div>
</header>
