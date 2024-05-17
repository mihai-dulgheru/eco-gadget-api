import { RecyclingLocation } from '../models';

export default async function () {
  const location = await RecyclingLocation.findOne({}).select('_id').lean();

  return [
    {
      locationId: location._id,
      email: 'lorem.ipsum@example.com',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus porta metus non tincidunt fermentum. Fusce ac vulputate neque, at ullamcorper nulla.',
      name: 'James Wilson',
    },
  ];
}
