import { DETAIL_IMAGES, HERO_IMAGE } from './content';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMins: number;
  image: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: 'what-to-expect-first-aid-course',
    title: 'What to Expect at Your First Aid & CPR Course',
    excerpt: 'Never taken a Red Cross course before? Here is how a typical training day runs, from check-in to certification.',
    category: 'Training Tips',
    date: '2026-11-10',
    readMins: 4,
    image: HERO_IMAGE,
    body: [
      'Your course day starts with a quick check-in and introductions. Instructors keep groups small so everyone gets hands-on practice.',
      'Most of the day is practical: you will practise CPR on manikins, use an AED trainer, and work through realistic emergency scenarios with classmates.',
      'Wear comfortable clothing you can kneel and move in, and bring a lunch and water bottle. No prior experience is needed.',
      'At the end of the course, successful participants receive a Canadian Red Cross certificate valid for three years.',
    ],
  },
  {
    slug: 'when-to-recertify',
    title: 'When Should You Recertify Your First Aid?',
    excerpt: 'Red Cross certifications last three years. Learn when a recert course is the right choice and how to plan ahead.',
    category: 'Certification',
    date: '2026-10-28',
    readMins: 3,
    image: DETAIL_IMAGES[0],
    body: [
      'Canadian Red Cross First Aid and CPR certifications are valid for three years from the date of completion.',
      'If your certificate is still current, a shorter recertification course lets you refresh your skills and renew in less time.',
      'Once a certificate has expired, you will need to take the full course again — so mark your expiry date and book early.',
    ],
  },
  {
    slug: 'cpr-steps-everyone-should-know',
    title: '5 CPR Steps Everyone Should Know',
    excerpt: 'Acting quickly in a cardiac emergency saves lives. A simple refresher on the steps you will master in class.',
    category: 'Safety',
    date: '2026-10-12',
    readMins: 5,
    image: DETAIL_IMAGES[2],
    body: [
      '1. Check the scene for safety, then check the person for responsiveness.',
      '2. Call 9-1-1 (or have someone call) and send someone for an AED.',
      '3. Begin chest compressions: push hard and fast in the centre of the chest, at 100–120 compressions per minute.',
      '4. Give rescue breaths if you are trained and willing — 30 compressions to 2 breaths.',
      '5. Use the AED as soon as it arrives and follow its voice prompts. This article is a reminder only — hands-on training is the best way to be ready.',
    ],
  },
  {
    slug: 'workplace-first-aid-requirements-ontario',
    title: 'Workplace First Aid Requirements in Ontario',
    excerpt: 'Employers in Ontario must have trained first aiders on site. Here is what that means for your team.',
    category: 'Workplace',
    date: '2026-09-30',
    readMins: 4,
    image: DETAIL_IMAGES[4],
    body: [
      'Ontario workplaces are required to have first aid stations and trained staff, with the number depending on workforce size.',
      'Standard First Aid with CPR Level C is the most commonly accepted certification for workplace requirements.',
      'Kanova Life offers group training at community centres across Thunder Bay, Nipigon and Terrace Bay — get in touch to train your whole team.',
    ],
  },
];
