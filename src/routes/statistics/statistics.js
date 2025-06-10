const router = require("express").Router();
const statisticsController = require("../../controllers/statistics/controller");
const { check_role } = require("../../middleware/roleMiddleware");

router.get("/", check_role("643263d04bede188dfb46d77"), statisticsController.getStatistics);
router.get("/years", check_role("643263d04bede188dfb46d77"), statisticsController.getYears);

module.exports = router;