const initDefaultUser = require("./initDefaultUser");
const initDefaultGroupUser = require("./initDefaultGroupUser");

const initAll = async () => {
  await initDefaultUser();
  await initDefaultGroupUser();
};

module.exports = initAll;
