
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

// --- Adding Opportunities Mock Data ---

export interface Opportunity {
  id: number | string;
  title: string;
  organizer: string;
  budget: number;
  skills: string[];
  description: string;
}

export const opportunities: Opportunity[] = [
    {
        id: 1,
        title: 'Promotional Video for Afrochella',
        organizer: 'Afrochella Events',
        budget: 5000,
        skills: ['Videography', 'Video Editing', 'Storytelling'],
        description: 'We need a stunning 2-minute promotional video to capture the vibrant energy of the Afrochella festival. The video should highlight key performances, audience reactions, and the overall cultural experience. The ideal candidate will have a strong portfolio of event videography and a passion for African music and culture.'
    },
    {
        id: 2,
        title: 'Social Media Graphics Pack',
        organizer: 'Sauti Sol Management',
        budget: 1500,
        skills: ['Graphic Design', 'Branding', 'Social Media'],
        description: 'Create a pack of 10 high-quality social media graphics (Instagram posts, stories, Twitter banners) for Sauti Sol\'s upcoming concert. Must adhere to their brand guidelines.'
    },
    {
        id: 3,
        title: 'Blog Post: "The Rise of Amapiano"',
        organizer: 'Amapiano Night Fest',
        budget: 500,
        skills: ['Writing', 'Music Journalism', 'SEO'],
        description: 'Write an engaging and informative 1500-word blog post about the cultural impact and global rise of the Amapiano music genre. The article will be featured on our event website.'
    },
    {
        id: 4,
        title: 'Live Event Photographer',
        organizer: 'Lagos Music Week',
        budget: 2500,
        skills: ['Photography', 'Event Photography', 'Photo Editing'],
        description: 'Capture high-resolution photos of performances, crowd, and behind-the-scenes moments during the 3-day Lagos Music Week. A portfolio of live event work is required.'
    }
];
