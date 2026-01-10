/* eslint-disable react/no-unescaped-entities */
import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import React from 'react'
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Ensure BASE_URL has proper protocol
const getBaseURL = () => {
  if (BASE_URL.startsWith('http://') || BASE_URL.startsWith('https://')) {
    return BASE_URL;
  }
  // Add https for production URLs, http for localhost
  return BASE_URL.includes('localhost') ? `http://${BASE_URL}` : `https://${BASE_URL}`;
};

const Page = async () => {
  'use cache';
  cacheLife('hours');
  
  try {
    const response = await fetch(`${getBaseURL()}/api/events`, {cache: 'no-store'});
    
    if (!response.ok) {
      console.error('Failed to fetch events:', response.status, response.statusText);
      // Return a fallback UI when API fails
      return (
        <section>
          <h1 className='text-center'>The Hub for Every Dev <br/>Event You Can't Miss </h1>
          <p className='text-center mt-5'>Hackathons, Meetups and Conferences, All in One Place </p>
          <ExploreBtn/>
          <div className='mt-20 space-y-7'>
            <h3>Featured Events</h3>
            <p className='text-center text-gray-500'>Unable to load events at the moment. Please try again later.</p>
          </div>
        </section>
      );
    }
    
    const data = await response.json();
    const events = data.events || [];
    
    return (
      <section>
        <h1 className='text-center'>The Hub for Every Dev <br/>Event You Can't Miss </h1>
        <p className='text-center mt-5'>Hackathons, Meetups and Conferences, All in One Place </p>

        <ExploreBtn/>

        <div className='mt-20 space-y-7'>
          <h3>Featured Events</h3>

          <ul className='events'>
            {events && events.length > 0 ? events.map((event: IEvent)=>(
                <li key={event.title} className='list-none'>
                    <EventCard {... event} />
                </li>
            )) : (
              <li className='text-center text-gray-500'>No events available at the moment.</li>
            )}
          </ul>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return error fallback UI
    return (
      <section>
        <h1 className='text-center'>The Hub for Every Dev <br/>Event You Can't Miss </h1>
        <p className='text-center mt-5'>Hackathons, Meetups and Conferences, All in One Place </p>
        <ExploreBtn/>
        <div className='mt-20 space-y-7'>
          <h3>Featured Events</h3>
          <p className='text-center text-gray-500'>Something went wrong loading events. Please refresh the page.</p>
        </div>
      </section>
    );
  }
}

export default Page