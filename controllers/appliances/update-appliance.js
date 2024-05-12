const updateAppliance = async (req, res) => {
  return res.json({
    message: 'Appliance updated successfully',
    data: req.body,
  });
};

export default updateAppliance;
