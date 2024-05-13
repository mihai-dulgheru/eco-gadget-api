import { formatDate } from 'date-fns';

export default [
  {
    date: formatDate(new Date(), 'yyyy-MM-dd'),
    location: {
      latitude: 44.43301523279083,
      longitude: 26.040600654474453,
      name: 'Street Name, City',
    },
    picture: {
      alt: 'Recycling Info',
      url: 'https://www.epa.gov/system/files/styles/medium/private/images/2023-10/rrb.jpg?itok=V4cyuIxw',
    },
    sections: [
      {
        content:
          'Recycling is the process of converting waste materials into new materials and objects. It is an alternative to "conventional" waste disposal that can save material and help lower greenhouse gas emissions.',
        heading: 'Recycling Basics',
      },
      {
        images: [
          {
            alt: 'Recycling Basics',
            url: 'https://www.epa.gov/system/files/styles/medium/private/images/2023-10/recycle.jpg?itok=PuKbSHlC',
          },
        ],
      },
      {
        video: {
          title: 'Recycling Basics',
          url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        },
      },
      {
        links: [
          {
            title: 'Recycling Guide',
            url: 'https://www.epa.gov/recycle',
          },
        ],
      },
      {
        contact: {
          address: '123 Main St, YourCity',
          email: 'example@email.com',
          phone: '+1234567890',
        },
      },
      {
        social: {
          facebook: 'https://www.facebook.com',
          instagram: 'https://www.instagram.com',
          twitter: 'https://www.twitter.com',
          youtube: 'https://www.youtube.com',
        },
      },
      {
        faqs: [
          {
            answer:
              'Recycling is the process of converting waste materials into new materials and objects. It is an alternative to "conventional" waste disposal that can save material and help lower greenhouse gas emissions.',
            question: 'What is recycling?',
          },
        ],
      },
    ],
    subtitle: 'Learn how to recycle',
    tags: ['recycling', 'environment', 'sustainability'],
    title: 'Recycling Info',
  },
];
