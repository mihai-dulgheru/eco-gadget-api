async function getRecyclingLocations(_req, res) {
  return res.json({
    data: [
      {
        _id: 1,
        name: 'Recycling Center 1',
        address: '123 Main St, YourCity',
        image:
          'https://sustainability.gsu.edu/files/2022/07/Recycling-Center-Commons.jpg',
        phone: '+1234567890',
        description:
          'This is a state-of-the-art facility that specializes in recycling electronics and hazardous materials.',
        schedule: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 2:00 PM',
          sunday: 'Closed',
        },
        company: 'EcoRecycle Inc.',
        cui: 'RO12345678',
        regCom: 'J12/3456/2009',
        latitude: 44.43301523279083,
        longitude: 26.040600654474453,
      },
    ],
  });
}

export default getRecyclingLocations;
