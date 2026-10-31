const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/vehicleController");
router.get("/", auth, controller.list);
router.post("/", auth, controller.create);
module.exports = router;
