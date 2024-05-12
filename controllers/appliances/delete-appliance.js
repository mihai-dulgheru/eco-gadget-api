const deleteAppliance = async (req, res) => {
  return res.json({
    message: 'Appliance deleted successfully',
    _id: req.params._id,
  });
};

export default deleteAppliance;
