
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  country: string;
  image: string;
  imageHint: string;
  price: number;
  currency: string;
  artistSplit: number;
  venueSplit: number;
  passaSplit: number;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Afrochella Festival',
    date: 'Dec 28, 2024',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'music festival',
    price: 50,
    currency: 'USD',
    artistSplit: 70,
    venueSplit: 20,
    passaSplit: 10,
  },
  {
    id: '2',
    title: 'Sauti Sol Live in Concert',
    date: 'Jan 15, 2025',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'concert stage',
    price: 75,
    currency: 'USD',
    artistSplit: 80,
    venueSplit: 15,
    passaSplit: 5,
  },
  {
    id: '3',
    title: 'Amapiano Night with Major League DJz',
    date: 'Feb 02, 2025',
    location: 'Johannesburg, South Africa',
    country: 'South Africa',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'dj performance',
    price: 40,
    currency: 'USD',
    artistSplit: 65,
    venueSplit: 25,
    passaSplit: 10,
  },
  {
    id: '4',
    title: 'Wizkid: Made in Lagos Tour',
    date: 'Feb 20, 2025',
    location: 'Accra, Ghana',
    country: 'Ghana',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'stadium concert',
    price: 100,
    currency: 'USD',
    artistSplit: 85,
    venueSplit: 10,
    passaSplit: 5,
  },
];

export const getEvents = (): Event[] => events;
