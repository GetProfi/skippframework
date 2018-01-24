export const createFieldsFromChildren = (fields = [], defaultFields = {}) => {
  let dataShape = {};

  fields.forEach((item) => {
    dataShape[item.id] = '';
  });

  dataShape = { ...dataShape, ...defaultFields };

  return dataShape;
};
