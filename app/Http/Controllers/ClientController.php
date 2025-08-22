<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::query();

        if ($request->has('q')) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        return $query->get(['id', 'name']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:clients,name',
        ]);

        $client = Client::create($validated);

        return response()->json($client, 201);
    }
}
