'use client'
import React from 'react'
import posthog from 'posthog-js';

const BookEvent = ({eventId, slug}: {eventId:string, slug:string}) => {
    const[email, setEmail]= React.useState('');
    const [submitted, setSubmitted]= React.useState(false);

    const handleSubmit= async (e: React.FormEvent)=> {
        e.preventDefault();

        try{
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, slug, email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                posthog.capture('event_booked', { eventId, slug, email });
            } else {
                console.error('Booking creation failed');
                posthog.captureException( 'Booking creation failed');
            }
        } catch (err) {
            console.error('Network error creating booking', err);
            posthog.captureException(err as Error);
        }
    }

  return (
    <div id='book-event'>
        {submitted ? (
            <p className='text-sm'>Thank you for signing up!</p>
        ): (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} id='email' placeholder='Enter your email address'/>
                </div>

                <button type='submit' className='button-submit'>Submit</button>
            </form>
        )}

    </div>
  )
}

export default BookEvent