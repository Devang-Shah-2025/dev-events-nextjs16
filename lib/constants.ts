export type EventItem = {
  id: string;
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string; // ISO date or human-friendly
  time: string;
  tags?: string[];
};

export const events: EventItem[] = [
  {
    id: 'wwdc-2026',
    title: 'WWDC 2026 — Apple Worldwide Developers Conference',
    image: '/images/event1.png',
    slug: 'wwdc-2026',
    location: 'Apple Park, Cupertino, CA (and online)',
    date: '2026-06-08',
    time: '10:00 PDT',
    tags: ['ios', 'macos', 'swift', 'developer']
  },
  {
    id: 'react-conf-2026',
    title: 'React Conf 2026',
    image: '/images/event2.png',
    slug: 'react-conf-2026',
    location: 'San Francisco, CA',
    date: '2026-10-12',
    time: '09:00 PDT',
    tags: ['react', 'web', 'frontend']
  },
  {
    id: 'google-io-2026',
    title: 'Google I/O 2026',
    image: '/images/event3.png',
    slug: 'google-io-2026',
    location: 'Mountain View, CA (and livestream)',
    date: '2026-05-19',
    time: '10:00 PDT',
    tags: ['android', 'web', 'cloud']
  },
  {
    id: 'pycon-2026',
    title: 'PyCon US 2026',
    image: '/images/event4.png',
    slug: 'pycon-2026',
    location: 'Pittsburgh, PA',
    date: '2026-04-15',
    time: '09:00 EDT',
    tags: ['python', 'data', 'backend']
  },
  {
    id: 'ghc-2026',
    title: 'GitHub Universe 2026',
    image: '/images/event5.png',
    slug: 'github-universe-2026',
    location: 'Las Vegas, NV (hybrid)',
    date: '2026-11-03',
    time: '09:30 PDT',
    tags: ['devops', 'opensource', 'platform']
  },
  {
    id: 'hackathon-nyc-spring-2026',
    title: 'NYC Spring Hackathon 2026',
    image: '/images/event6.png',
    slug: 'nyc-spring-hackathon-2026',
    location: 'New York, NY',
    date: '2026-03-21',
    time: '11:00 EDT',
    tags: ['hackathon', 'startup', 'ml']
  },
  {
    id: 'local-dev-meetup',
    title: 'Local Dev Meetup — Community Night',
    image: '/images/event-full.png',
    slug: 'local-dev-meetup',
    location: 'Community Tech Hub (various cities)',
    date: '2026-01-22',
    time: '18:30',
    tags: ['meetup', 'networking']
  }
];

export default events;
