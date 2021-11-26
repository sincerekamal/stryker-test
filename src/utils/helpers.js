const opReplacers = {
  " gt ": " > ",
  " gte ": " >= ",
  " lt ": " < ",
  " lte ": " <= ",
  " eq ": " = ",
  " ne ": " != ",
};

const withScope = (scopeName, ...args) => {
  return {
    method: [scopeName, ...args],
  };
};

const getDataScope = (user) => {
  if (user.role_id === 1) {
    return withScope("own", user.id);
  } else if (user.role_id === 2) {
    return withScope("manager", user.id);
  } else if (user.role_id === 3) {
    return "admin";
  } else {
    return
  }
};

const replaceOps = (queryStr) => {
  if (typeof queryStr !== "string" || queryStr.length < 6) return queryStr;
  return queryStr.replace(
    new RegExp(Object.keys(opReplacers).join("|"), "gi"),
    (m) => opReplacers[m.toLowerCase()]
  );
};

module.exports = {
  getDataScope,
  replaceOps,
};
