import { RecyclingLocation } from '../models';

export default async function () {
  const locations = await RecyclingLocation.find().select('_id').lean();

  return [
    {
      locationId: locations[0]._id,
      email: 'contact@example.com',
      message:
        'Bună ziua, am nevoie de informații despre reciclarea unui frigider vechi.',
      name: 'Andrei Popescu',
    },
    {
      locationId: locations[1]._id,
      email: 'info@example.com',
      message:
        'Bună ziua, ce opțiuni de reciclare aveți pentru aparate electrocasnice?',
      name: 'Maria Ionescu',
    },
    {
      locationId: locations[2]._id,
      email: 'support@example.com',
      message:
        'Bună ziua, aș dori să aflu mai multe despre reciclarea deșeurilor periculoase.',
      name: 'Ion Georgescu',
    },
    {
      locationId: locations[3]._id,
      email: 'service@example.com',
      message:
        'Bună ziua, ce trebuie să fac pentru a recicla un televizor vechi?',
      name: 'Elena Vasilescu',
    },
    {
      locationId: locations[0]._id,
      email: 'help@example.com',
      message:
        'Bună ziua, am baterii vechi și becuri arse. Cum le pot recicla?',
      name: 'Vlad Dumitrescu',
    },
    {
      locationId: locations[1]._id,
      email: 'info@example.org',
      message:
        'Bună ziua, aveți programe speciale pentru reciclarea deșeurilor din construcții?',
      name: 'Mihai Andrei',
    },
    {
      locationId: locations[2]._id,
      email: 'contact@example.org',
      message:
        'Bună ziua, sunt interesat de reciclarea aparatelor electronice mici. Ce opțiuni aveți?',
      name: 'Ana Maria Popa',
    },
    {
      locationId: locations[3]._id,
      email: 'support@example.net',
      message:
        'Bună ziua, aș dori să reciclez un cuptor cu microunde. Ce pași trebuie să urmez?',
      name: 'Cristina Iliescu',
    },
  ];
}
