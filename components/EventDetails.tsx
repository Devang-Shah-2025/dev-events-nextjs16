import React from 'react'
import BookEvent from './BookEvent';
import EventCard from './EventCard';
import { IEvent } from '@/database';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';
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

const EventDetailItem= ({icon, alt, label}:{icon:string; alt:string; label:string})=> (
  <div className='flex flex-row gap-2 items-center'>
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>{label}</p>
  </div>
)

const EventAgenda=({agendaItems}: {agendaItems: string[]})=> (
  <div className='agenda'>
    <h2>Event Agenda</h2>
    <ul>
      {agendaItems.map((item, index)=>(
        <li key={item} >{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags= ({tags}: {tags: string[]})=> (
  <div className='flex flex-row gap-1.5 flex-wrap '>
    {tags.map((tag)=>(
      <div className='pill' key={tag}>{tag}</div>
    ))}
  </div>
)


const EventDetails = async ({ params }: { params:Promise<string> }) => {
    'use cache';
  cacheLife('hours');
  const  slug  = await params;

  try {
    const request = await fetch(`${getBaseURL()}/api/events/${slug}`);
    
    if (!request.ok) {
      console.error('Failed to fetch event:', request.status, request.statusText);
      return notFound();
    }
    
    const data = await request.json();
    const { event } = data;

    if (!event || !event.description) return notFound();
    const { description, image, overview, date, time, location, mode, agenda, audience, organizer, tags } = event;

    const bookings= 10;

    let similarEvents: IEvent[] = [];
    try {
      similarEvents = await getSimilarEventsBySlug(slug);
    } catch (e) {
      console.error('Failed to fetch similar events:', e);
    }

    console.log(similarEvents);
  return (
    <section id='event'>
      <div className='header'>
        <h1>Event Description</h1>
        <p className=''>{description}</p>
      </div>

      <div className='details'>
        {/* Left Side- Event Content */}
        <div className='content'>
        <Image src={image} alt='Event Banner' width={800} height={800} className='banner'/>

        <section className='flex flex-col gap-2'>
          <h2>Overview</h2>
          <p>{overview}</p>
        </section>
        <section className='flex flex-col gap-2'>
          <h2>Event Details</h2>
          <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={date}/>
          <EventDetailItem icon='/icons/clock.svg' alt='clock' label={time}/>
          <EventDetailItem icon='/icons/pin.svg' alt='location' label={location}/>
          <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode}/>
          <EventDetailItem icon='/icons/audience.svg' alt='audience' label={audience}/>
          
          </section>
          <EventAgenda agendaItems={agenda} />

          <section className='flex flex-col gap-2 '>
            <h2>About the Organizer </h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags}/>
        </div>
        {/* Right Side- Booking Form */}
        <aside className='booking'>
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings>0 ? (
              <p className='text-sm'>
                Join {bookings} people who have already booked their spot!
              </p>
            ): 
            (
              <p className='text-sm '>Be the first to book your spot!</p>
            )}

            <BookEvent eventId={event._id} slug={event.slug}/>
          </div>
        </aside>
      </div>
      <div className='flex w-full flex-col gap-4 pt-20'>
        <h2>Similar Events</h2>
        <div className='events'>
          {similarEvents.length>0 && similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent.slug} {...similarEvent}/>
          ))}
        </div>


      </div>
    </section>
  );
  } catch (error) {
    console.error('Error loading event details:', error);
    return notFound();
  }
}

export default EventDetails