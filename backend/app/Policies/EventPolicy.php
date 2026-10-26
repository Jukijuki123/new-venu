<?php

// app/Policies/EventPolicy.php
namespace App\Policies;

use App\Models\{Event, User};

class EventPolicy
{
    public function update(User $user, Event $event): bool
    {
        return $user->role === 'school' && $event->school_id === $user->school->id;
    }

    public function delete(User $user, Event $event): bool
    {
        return $this->update($user, $event) && $event->status === 'draft'; // poin 10: hanya draft yang bisa dihapus
    }

    public function publish(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }

    public function manageApplications(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }
}
