async function getAccountInfo(req, res) {
  res.json(req.user);
}

export default getAccountInfo;
