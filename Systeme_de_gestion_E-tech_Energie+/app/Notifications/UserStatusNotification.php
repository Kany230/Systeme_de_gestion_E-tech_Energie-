<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserStatusNotification extends Notification
{
    use Queueable;

    protected $messageContent;

    /**
     * Create a new notification instance.
     */
    public function __construct($messageContent)
    {
        $this->messageContent = $messageContent;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('[' . config('app.name') . '] Mise à jour de votre compte utilisateur')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Nous vous adressons cette notification pour vous informer d\'un changement de statut concernant votre accès à la plateforme **' . config('app.name') . '**.')
            ->line('**Note de l\'administration :**')
            ->line($this->messageContent)
            ->action('Accéder à mon espace', url('/login')) // Assurez-vous que l'URL est correcte
            ->line('Si vous avez des questions concernant cette décision, nous vous invitons à contacter notre support technique.')
            ->salutation('Cordialement,' . "\n" . 'L\'équipe de gestion ' . config('app.name'));
    
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
