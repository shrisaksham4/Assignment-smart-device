const express = require("express");
const { registerDevice, filterDevices, updateDevice, deleteDevice, updateLastActive, createLog, fetchLogs, aggUsage } = require("../controllers/deviceControllers");
const {authHandler} = require("../middlewares/authMiddleware")
const router = express.Router();

router.route('/').post(authHandler, registerDevice).get(authHandler, filterDevices);
router.route('/:id').patch(authHandler, updateDevice).delete(authHandler, deleteDevice);
router.post('/:id/heartbeat', authHandler, updateLastActive);
router.route("/:id/logs").post(authHandler, createLog).get(authHandler, fetchLogs);
router.get("/:id/usage", authHandler, aggUsage);


module.exports = router;
