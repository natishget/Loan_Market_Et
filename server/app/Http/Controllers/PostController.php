<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    function index() {
        return 'index';
    }

    function store(){
        return 'store';
    }

    function show($id){
        return 'show_'.$id;
    }

    function update($id){
        return 'update_'.$id;
    }
}
