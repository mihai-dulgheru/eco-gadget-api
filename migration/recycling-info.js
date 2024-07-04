import { formatDate } from 'date-fns';
import { User } from '../models';

export default async function () {
  const admin = await User.findOne({ role: 'admin' }).select('_id').lean();

  return [
    {
      createdBy: admin._id,
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      location: {
        longitude: 26.1025,
        latitude: 44.4268,
        name: 'Strada Principală, București',
      },
      picture: {
        alt: 'Informații despre reciclare',
        url: 'https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/rrb.jpg',
      },
      sections: [
        {
          heading: 'Bazele reciclării',
        },
        {
          content:
            'Reciclarea este procesul de transformare a deșeurilor în materiale și obiecte noi. Este o alternativă la eliminarea convențională a deșeurilor, care poate economisi materiale și poate reduce emisiile de gaze cu efect de seră.',
        },
        {
          contact: {
            address: 'Strada Principală, Nr. 123, București',
            email: 'reciclare@example.com',
            phone: '0314123456',
          },
        },
      ],
      subtitle: 'Aflați cum să reciclați',
      tags: ['reciclare', 'mediu', 'sustenabilitate'],
      title: 'Informații despre reciclare',
    },
    {
      createdBy: admin._id,
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      location: {
        longitude: 26.0975,
        latitude: 44.4278,
        name: 'Bulevardul Unirii, București',
      },
      picture: {
        alt: 'Importanța reciclării',
        url: 'https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/recycle.jpg',
      },
      sections: [
        {
          heading: 'De ce este importantă reciclarea?',
        },
        {
          content:
            'Reciclarea reduce necesitatea de a extrage, rafina și prelucra materii prime, toate acestea creând poluare aeriană și apă. Conservă resursele naturale și contribuie la prevenirea distrugerii habitatelor naturale.',
        },
        {
          contact: {
            address: 'Bulevardul Unirii, Nr. 45, București',
            email: 'info@reciclarebucuresti.ro',
            phone: '0314156789',
          },
        },
      ],
      subtitle: 'Contribuiți la protejarea mediului',
      tags: ['reciclare', 'protecția mediului', 'resurse naturale'],
      title: 'Importanța reciclării',
    },
    {
      createdBy: admin._id,
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      location: {
        longitude: 26.1125,
        latitude: 44.4378,
        name: 'Strada Ecologiei, București',
      },
      picture: {
        alt: 'Ghidul reciclării corecte',
        url: 'https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/what.jpg',
      },
      sections: [
        {
          heading: 'Ghidul reciclării corecte',
        },
        {
          content:
            'Pentru a recicla corect, este important să cunoașteți ce materiale pot fi reciclate și cum trebuie pregătite. De exemplu, sticla, metalul, hârtia și cartonul sunt în general reciclabile, dar trebuie curățate de orice resturi de mâncare sau alte contaminanți.',
        },
        {
          contact: {
            address: 'Strada Ecologiei, Nr. 99, București',
            email: 'contact@reciclarecorecta.ro',
            phone: '0314167890',
          },
        },
      ],
      subtitle: 'Învață să reciclezi corect',
      tags: ['reciclare', 'ghid', 'corect'],
      title: 'Ghidul reciclării corecte',
    },
    {
      createdBy: admin._id,
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      location: {
        longitude: 26.1225,
        latitude: 44.4478,
        name: 'Strada Verde, București',
      },
      picture: {
        alt: 'Beneficiile reciclării',
        url: 'https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/recycling_benefits.png',
      },
      sections: [
        {
          heading: 'Beneficiile reciclării',
        },
        {
          content:
            'Reciclarea oferă numeroase beneficii, inclusiv reducerea poluării, economisirea energiei și resurselor naturale, și crearea de locuri de muncă. Fiecare mic gest contează, de la sortarea corectă a deșeurilor până la reutilizarea obiectelor.',
        },
        {
          contact: {
            address: 'Strada Verde, Nr. 22, București',
            email: 'beneficii@reciclareverde.ro',
            phone: '0314178901',
          },
        },
      ],
      subtitle: 'Descoperă beneficiile reciclării',
      tags: ['reciclare', 'beneficii', 'mediu'],
      title: 'Beneficiile reciclării',
    },
    {
      createdBy: admin._id,
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      location: {
        longitude: 26.1325,
        latitude: 44.4578,
        name: 'Strada Pădurii, București',
      },
      picture: {
        alt: 'Reciclarea electronicelor',
        url: 'https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/electronics_recycling.jpeg',
      },
      sections: [
        {
          heading: 'Reciclarea electronicelor',
        },
        {
          content:
            'Reciclarea deșeurilor electronice este esențială pentru a preveni poluarea și a recupera metale prețioase și rare. Asigură-te că dispozitivele electronice vechi sunt predate la centre de colectare autorizate pentru a fi reciclate în condiții de siguranță.',
        },
        {
          contact: {
            address: 'Strada Pădurii, Nr. 101, București',
            email: 'electro@reciclare.ro',
            phone: '0314189012',
          },
        },
      ],
      subtitle: 'Cum să reciclezi electronicele',
      tags: ['reciclare', 'electronice', 'mediu'],
      title: 'Reciclarea electronicelor',
    },
  ];
}
