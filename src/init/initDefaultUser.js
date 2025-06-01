const Users = require("../models/users/model");
const { sha512 } = require("js-sha512");

const initDefaultUser = async () => {
  try {
    const count = await Users.estimatedDocumentCount();

    if (count === 0) {
      await Users.create({
        display_name: "IT Vũng Tàu",
        username: "itvt",
        password: sha512("abc123"),
        email: "teamseoit@gmail.com",
        group_user_id: "6684196550a34692df218d8d"
      });
    }
  } catch (err) {
    console.error("Error initializing default user:", err.message);
  }
};

module.exports = initDefaultUser;
