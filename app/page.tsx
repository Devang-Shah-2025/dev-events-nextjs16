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
    const response= await fetch(`${getBaseURL()}/api/events`, {cache: 'no-store'});
    const {events}= await response.json();
  return (
    <section>
      <h1 className='text-center'>The Hub for Every Dev <br/>Event You Can't Miss </h1>
      <p className='text-center mt-5'>Hackathons, Meetups and Conferences, All in One Place </p>

      <ExploreBtn/>

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>

        <ul className='events'>
          {events && events.length > 0 && events.map((event: IEvent)=>(
              <li key={event.title} className='list-none'>
                  <EventCard {... event} />
              </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page