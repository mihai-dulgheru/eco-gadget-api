import { RecyclingLocation } from '../models';

export default async function () {
  const location = await RecyclingLocation.findOne({}).select('_id').lean();

  return [
    {
      locationId: location._id,
      email: 'contact@example.com',
      message:
        'Bună ziua, am nevoie de informații despre reciclarea unui frigider vechi.',
      name: 'Andrei Popescu',
    },
    {
      locationId: location._id,
      email: 'info@example.com',
      message:
        'Bună ziua, ce opțiuni de reciclare aveți pentru aparate electrocasnice?',
      name: 'Maria Ionescu',
    },
  ];
}
