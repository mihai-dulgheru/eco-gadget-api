async function getRecyclingInfo(_req, res) {
  return res.json({
    data: [
      {
        _id: 1,
        createdAt: new Date(),
        createdBy: 'Admin',
        date: '2022-07-01',
        picture: {
          alt: 'Recycling Info',
          url: 'https://www.epa.gov/system/files/styles/medium/private/images/2023-10/rrb.jpg?itok=V4cyuIxw',
        },
        sections: [
          {
            _id: 1,
            content:
              'Recycling is the process of converting waste materials into new materials and objects. It is an alternative to "conventional" waste disposal that can save material and help lower greenhouse gas emissions.',
            heading: 'Recycling Basics',
          },
          {
            _id: 2,
            images: [
              {
                _id: 1,
                alt: 'Recycling Basics',
                url: 'https://www.epa.gov/system/files/styles/medium/private/images/2023-10/recycle.jpg?itok=PuKbSHlC',
              },
            ],
          },
          {
            _id: 3,
            video: {
              title: 'Recycling Basics',
              url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            },
          },
          {
            _id: 4,
            map: { latitude: 44.43301523279083, longitude: 26.040600654474453 },
          },
          {
            _id: 5,
            links: [
              {
                _id: 1,
                title: 'Recycling Guide',
                url: 'https://www.epa.gov/recycle',
              },
            ],
          },
          {
            _id: 6,
            contact: {
              address: '123 Main St, YourCity',
              email: 'example@email.com',
              phone: '+1234567890',
            },
          },
          {
            _id: 7,
            social: {
              facebook: 'https://www.facebook.com',
              instagram: 'https://www.instagram.com',
              twitter: 'https://www.twitter.com',
              youtube: 'https://www.youtube.com',
            },
          },
          {
            _id: 8,
            faqs: [
              {
                _id: 1,
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
        updatedAt: new Date(),
        updatedBy: 'Admin',
      },
    ],
  });
}

export default getRecyclingInfo;
