import { formatDate } from 'date-fns';

export default async function () {
  return [
    {
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      location: {
        longitude: 26.1025,
        latitude: 44.4268,
        name: 'Strada Principală, București',
      },
      picture: {
        alt: 'Informații despre reciclare',
        url: 'https://www.epa.gov/system/files/styles/medium/private/images/2023-10/rrb.jpg?itok=V4cyuIxw',
      },
      sections: [
        {
          content:
            'Reciclarea este procesul de transformare a deșeurilor în materiale și obiecte noi. Este o alternativă la eliminarea convențională a deșeurilor, care poate economisi materiale și poate reduce emisiile de gaze cu efect de seră.',
          heading: 'Bazele reciclării',
        },
        {
          images: [
            {
              alt: 'Bazele reciclării',
              url: 'https://www.epa.gov/system/files/styles/medium/private/images/2023-10/recycle.jpg?itok=PuKbSHlC',
            },
          ],
        },
        {
          video: {
            title: 'Bazele reciclării',
            url: 'https://videos.pexels.com/video-files/3196599/3196599-hd_1280_720_25fps.mp4',
          },
        },
        {
          links: [
            {
              title: 'Ghid de reciclare',
              url: 'https://www.epa.gov/recycle',
            },
          ],
        },
        {
          contact: {
            address: 'Strada Principală, Nr. 123, București',
            email: 'reciclare@example.com',
            phone: '+40314123456',
          },
        },
        {
          social: {
            facebook: 'https://www.facebook.com/reciclare',
            instagram: 'https://www.instagram.com/reciclare',
            twitter: 'https://www.twitter.com/reciclare',
            youtube: 'https://www.youtube.com/reciclare',
          },
        },
        {
          faqs: [
            {
              answer:
                'Reciclarea este procesul de transformare a deșeurilor în materiale și obiecte noi.',
              question: 'Ce este reciclarea?',
            },
          ],
        },
      ],
      subtitle: 'Aflați cum să reciclați',
      tags: ['reciclare', 'mediu', 'sustenabilitate'],
      title: 'Informații despre reciclare',
    },
  ];
}
