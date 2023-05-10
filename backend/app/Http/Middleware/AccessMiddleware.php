<?php

namespace App\Http\Middleware;

use Closure;

class AccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $access = 1)
    {
        try {
            if(auth()->user()->is_verified == $access){
                return $next($request);
            }    
            return response()->json(['status' => 'errors', 'message' => 'please verify your phone number', 'data'=> auth()->user()], 403);
        }
        catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}
