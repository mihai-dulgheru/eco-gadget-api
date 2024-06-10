async function convertFormDataToJson(req, _res, next) {
  try {
    const { formData } = req.body;
    req.body = JSON.parse(formData);
    next();
  } catch (error) {
    next(error);
  }
}

export default convertFormDataToJson;
