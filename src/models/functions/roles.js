const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const userchema = new mongoose.Schema({
  function_id: {
    type: ObjectId,
    required: true,
    index: true
  },
  group_user_id:{
    type: ObjectId,
    required: true,
    index: true
  }
});

const Roles = mongoose.model("Roles", userchema);
module.exports = Roles;

const init = async () => {
  const count = await Roles.estimatedDocumentCount();
  if (count == 0) {
    const array = [
      {
        _id: new ObjectId("668653c9e55c5173ec41c919"),
        function_id: new ObjectId("66746193cb45907845239f36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c91b"),
        function_id: new ObjectId("66746193cb45907845239f37"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c91d"),
        function_id: new ObjectId("66746193cb45907845239f38"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c91f"),
        function_id: new ObjectId("66746193cb45907845239f50"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c921"),
        function_id: new ObjectId("66746193cb45907845239f39"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c923"),
        function_id: new ObjectId("66746193cb45907845239f3a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c925"),
        function_id: new ObjectId("66746193cb45907845239f4a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c927"),
        function_id: new ObjectId("667463d04bede188dfb46d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c929"),
        function_id: new ObjectId("667463d04bede188dfb46d77"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c92b"),
        function_id: new ObjectId("667463d04bede188dfb46d78"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c92d"),
        function_id: new ObjectId("667463d04bede188dfb46d79"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c92f"),
        function_id: new ObjectId("667463d04bede188dfb46d80"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c931"),
        function_id: new ObjectId("667463d04bede188dfb46d81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c933"),
        function_id: new ObjectId("667463d04bede188dfb46a81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c935"),
        function_id: new ObjectId("667463d04bede188dfb46e81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c937"),
        function_id: new ObjectId("667463d04bede188dfb46f81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c939"),
        function_id: new ObjectId("667463d04bede188dfb46d7e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c93b"),
        function_id: new ObjectId("667463d04bede188dfb46d7f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c93d"),
        function_id: new ObjectId("667463d04bede188dfb46b7f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c93f"),
        function_id: new ObjectId("667463d04bede188dfb46d7b"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c941"),
        function_id: new ObjectId("667463d04bede188dfb46d7c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c943"),
        function_id: new ObjectId("667463d04bede188dfb46c7c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c945"),
        function_id: new ObjectId("66746678f7f723b779b1b05f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c947"),
        function_id: new ObjectId("667467eb263fb998b9925d2e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c949"),
        function_id: new ObjectId("667467eb263fb998b9925d2f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c94b"),
        function_id: new ObjectId("66746678f7f723b779b1b060"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c94d"),
        function_id: new ObjectId("66746678f7f723b779b1b061"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c94f"),
        function_id: new ObjectId("667467eb263fb998b9925d30"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c951"),
        function_id: new ObjectId("667467eb263fb998b9925d31"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c953"),
        function_id: new ObjectId("66746678f7f723b779b1b062"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c955"),
        function_id: new ObjectId("66746678f7f723b779b1b063"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c957"),
        function_id: new ObjectId("667467eb263fb998b9925d32"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c959"),
        function_id: new ObjectId("667467eb263fb998b9925d33"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c95b"),
        function_id: new ObjectId("66746678f7f723b779b1b064"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c95d"),
        function_id: new ObjectId("66746678f7f723b779b1b065"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c95f"),
        function_id: new ObjectId("667467eb263fb998b9925d34"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c961"),
        function_id: new ObjectId("667467eb263fb998b9925d35"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c963"),
        function_id: new ObjectId("66746678f7f723b779b1b066"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c965"),
        function_id: new ObjectId("66746678f7f723b779b1b067"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c967"),
        function_id: new ObjectId("667467eb263fb998b9925d36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c969"),
        function_id: new ObjectId("667467eb263fb998b9925d37"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c96b"),
        function_id: new ObjectId("66746678f7f723b779b1b068"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c96d"),
        function_id: new ObjectId("66746678f7f723b779b1b069"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c96f"),
        function_id: new ObjectId("667467eb263fb998b9925d38"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c971"),
        function_id: new ObjectId("66746678f7f723b779b1b06b"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c973"),
        function_id: new ObjectId("66746678f7f723b779b1b06a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c975"),
        function_id: new ObjectId("66746678f7f723b779b1b06c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c976"),
        function_id: new ObjectId("66746678f7f723b779b1b06d"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c977"),
        function_id: new ObjectId("66746193cb45907845239f36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c979"),
        function_id: new ObjectId("66746678f7f723b779b1b06e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c97b"),
        function_id: new ObjectId("66746678f7f723b779b1b06f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c97d"),
        function_id: new ObjectId("66746678f7f723b779b1b070"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c97f"),
        function_id: new ObjectId("66746678f7f723b779b1b071"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c981"),
        function_id: new ObjectId("66746678f7f723b779b1b072"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c983"),
        function_id: new ObjectId("66746678f7f723b779b1b073"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c985"),
        function_id: new ObjectId("66746678f7f723b779b1b074"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c987"),
        function_id: new ObjectId("66746678f7f723b779b1b075"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c989"),
        function_id: new ObjectId("66746678f7f723b779b1b076"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c98b"),
        function_id: new ObjectId("667467eb263fb998b9925d39"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c98d"),
        function_id: new ObjectId("667467eb263fb998b9925d3a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c98f"),
        function_id: new ObjectId("667467eb263fb998b9925d3b"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c991"),
        function_id: new ObjectId("667467eb263fb998b9925d3c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c993"),
        function_id: new ObjectId("667467eb263fb998b9925d3d"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c995"),
        function_id: new ObjectId("667467eb263fb998b9925d3e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c997"),
        function_id: new ObjectId("667467eb263fb998b9925d3f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c999"),
        function_id: new ObjectId("667467eb263fb998b9925d40"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c99b"),
        function_id: new ObjectId("667467eb263fb998b9925d41"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c99d"),
        function_id: new ObjectId("667467eb263fb998b9925d42"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c99f"),
        function_id: new ObjectId("667467eb263fb998b9925d43"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a1"),
        function_id: new ObjectId("667467eb263fb998b9925d44"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a3"),
        function_id: new ObjectId("667467eb263fb998b9925d45"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a5"),
        function_id: new ObjectId("667467eb263fb998b9925d46"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a7"),
        function_id: new ObjectId("667467eb263fb998b9925d47"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a9"),
        function_id: new ObjectId("667467eb263fb998b9925d48"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //backups
      {
        _id: new ObjectId("674153c9e55c5173ec41c9a9"),
        function_id: new ObjectId("643263d04bede188dfb46d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // ip whitelist
      {
        _id: new ObjectId("674153c9e55c5173ff41c9a9"),
        function_id: new ObjectId("643263d04bede188fff66d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("674153c9e55c5173ef41c9a9"),
        function_id: new ObjectId("643263d04bede188dff66d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("674153c9e55c5173ee41c9a9"),
        function_id: new ObjectId("643263d04bede188dff67d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
    ];
    await Roles.insertMany(array);
  }
}

init()