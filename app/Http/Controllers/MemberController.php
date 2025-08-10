<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use Inertia\Inertia;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('members/index', [
            'members' => Member::paginate(),
        ]);
    }

    public function store(StoreMemberRequest $request)
    {
        Member::create($request->validated());

        return redirect()->route('members.index');
    }

    public function show(Member $member)
    {
        return Inertia::render('members/show', [
            'member' => $member,
        ]);
    }

    public function edit(Member $member)
    {
        return Inertia::render('members/edit', [
            'member' => $member,
        ]);
    }

    public function update(UpdateMemberRequest $request, Member $member)
    {
        $member->update($request->validated());

        return redirect()->route('members.index');
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return redirect()->route('members.index');
    }
}