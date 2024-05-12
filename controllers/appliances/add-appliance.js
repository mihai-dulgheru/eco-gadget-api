const addAppliance = async (req, res) => {
  return res.status(201).json({
    message: 'Appliance added successfully',
    data: req.body,
  });
};

export default addAppliance;
