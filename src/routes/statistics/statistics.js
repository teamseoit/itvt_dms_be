const router = require("express").Router();
const statisticsController = require("../../controllers/statistics/controller");
const { check_role } = require("../../middleware/roleMiddleware");

router.get("/services", check_role("643263d04bede188dfb46d77"), statisticsController.getServices);
router.get("/expense-report", check_role("643263d04bede188dfb46d77"), statisticsController.getServicesExpenseReport);
router.get("/expense-report/years", check_role("643263d04bede188dfb46d77"), statisticsController.getExpenseReportYears);

module.exports = router;