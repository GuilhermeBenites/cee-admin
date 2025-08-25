<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Category;
use App\Models\Client;
use App\Models\Member;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        return Inertia::render('transactions/index', [
            'transactions' => Transaction::with('user', 'client')
                ->when($request->input('date'), function ($query, $date) {
                    $query->whereDate('transaction_date', $date);
                })
                ->latest()
                ->paginate(15)
                ->withQueryString(),
            'categories' => Category::orderBy('name')->get(['id', 'name', 'type']),
            'members' => Member::orderBy('name')->get(['id', 'name']),
            'clients' => Client::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['date']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $transaction = Transaction::create([
                'total_amount' => collect($validated['items'])->sum(fn ($i) => $i['item_amount']),
                'transaction_date' => $validated['transaction_date'],
                'payment_method' => $validated['payment_method'],
                'user_id' => auth()->id(),
                'description' => $validated['description'] ?? null,
                'client_id' => $validated['client_id'],
            ]);

            $transaction->items()->createMany($validated['items']);
        });

        return redirect()->route('transactions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'items']);
        if (request()->wantsJson()) {
            return response()->json($transaction);
        }
        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($transaction, $validated) {
            $transaction->update([
                'total_amount' => collect($validated['items'])->sum(fn ($i) => $i['item_amount']),
                'transaction_date' => $validated['transaction_date'],
                'payment_method' => $validated['payment_method'],
                'description' => $validated['description'] ?? null,
                'client_id' => $validated['client_id'],
            ]);

            $transaction->items()->delete();
            $transaction->items()->createMany($validated['items']);
        });

        return redirect()->route('transactions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('transactions.index');
    }
}
