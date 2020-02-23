export default function objectToInput(
  object,
  ignoreKeys = [],
  primaryKey = "id",
  foreignKeySuffix = ""
) {
  const input = {};

  Object.keys(object).forEach(key => {
    if (key.match(/^__/)) return;

    if (ignoreKeys.includes(key)) return;

    if (
      typeof object[key] === "object" &&
      !Array.isArray(object[key]) &&
      object[key] &&
      !object[key].data
    ) {
      if (!object[key] || !object[key][primaryKey]) return; // WARN: this skips all object without 'id' property
      const foreignKey = `${key}${foreignKeySuffix}`;
      input[foreignKey] = object[key][primaryKey];
    } else {
      if (Array.isArray(object[key]) && typeof object[key][0] === "object") {
        return;
      }
      input[key] = object[key];
    }
  });

  return input;
}
