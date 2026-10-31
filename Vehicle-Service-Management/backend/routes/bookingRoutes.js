const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/bookingController");

router.get("/", auth, controller.list);
router.post("/", auth, controller.create);

router.patch("/:id/manager", auth, controller.updateByManager);
router.patch("/:id/mechanic", auth, controller.updateByMechanic);

module.exports = router;