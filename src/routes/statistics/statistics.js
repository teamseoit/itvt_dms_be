const router = require("express").Router();
const statisticsController = require("../../controllers/statistics/controller");

router.get("/", statisticsController.getStatistics);
router.get("/years", statisticsController.getYears);

module.exports = router;