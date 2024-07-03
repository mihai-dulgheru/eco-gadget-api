import { set } from 'lodash';

async function convertFormDataToJson(req, _res, next) {
  try {
    const formData = req.body;
    const result = {};

    Object.entries(formData).forEach(([key, value]) => {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // Do nothing
      }
      set(result, key, value);
    });

    req.body = result.formData;
    next();
  } catch (error) {
    next(error);
  }
}

export default convertFormDataToJson;
