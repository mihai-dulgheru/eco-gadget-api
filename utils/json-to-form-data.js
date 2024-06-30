function jsonToFormData(json, formData = new FormData(), parentKey = '') {
  Object.keys(json).forEach((key) => {
    const value = json[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof Object && !(value instanceof File)) {
      jsonToFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value);
    }
  });

  return formData;
}

export default jsonToFormData;
