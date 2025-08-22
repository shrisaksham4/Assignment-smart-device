const asyncHandler = require("express-async-handler");
const Device = require("../models/deviceModel");
const Log = require("../models/logModel");

const registerDevice = asyncHandler(async (req, res) => {
  try {
    const { name, type, status } = req.body;

    const device = await Device.create({
      name,
      type,
      status,
      owner_id: req.user.id,
    });

    res
      .status(201)
      .json({
        success: true,
        device: {
          id: device._id,
          name: device.name,
          type: device.type,
          status: device.status,
          last_active_at: device.last_active_at,
          owner_id: device.owner_id,
        },
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

const filterDevices = asyncHandler(async (req, res) => {
  try {
    const { type, status } = req.query;

    const filter = { owner_id: req.user.id }; 

    if (type) filter.type = type;
    if (status) filter.status = status;

    const devices = await Device.find(filter);

    res.json({
      success: true,
      count: devices.length,
      devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const updateDevice = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.type) updates.type = req.body.type;
    if (req.body.status) updates.status = req.body.status;
    if (req.body.last_active_at)
      updates.last_active_at = req.body.last_active_at;

    const device = await Device.findOneAndUpdate(
      { _id: id, owner_id: req.user.id }, 
      { $set: updates },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found or not authorized",
      });
    }

    res.json({ success: true, device });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const deleteDevice = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;

      const device = await Device.findOneAndDelete({
        _id: id,
        owner_id: req.user.id,
      });

      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found or not authorized to delete",
        });
      }

      res.json({
        success: true,
        message: "Device deleted successfully",
        device,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
})

const updateLastActive = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const update = { last_active_at: new Date() };
      if (status) update.status = status;

      const device = await Device.findOneAndUpdate(
        { _id: id, owner_id: req.user.id },
        { $set: update },
        { new: true }
      );

      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found or not authorized",
        });
      }

      res.json({
        success: true,
        message: "Device heartbeat recorded",
        last_active_at: device.last_active_at.toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
})

const createLog = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      const { event, value } = req.body;

      const device = await Device.findOne({ _id: id, owner_id: req.user.id });
      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found or not authorized",
        });
      }

      const log = await Log.create({
        device_id: device._id,
        owner_id: req.user.id,
        event,
        value,
      });

      res.status(201).json({
        success: true,
        message: "Log entry created",
        log,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
})

const fetchLogs = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      const device = await Device.findOne({ _id: id, owner_id: req.user.id });
      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found or not authorized",
        });
      }

      const logs = await Log.find({ device_id: id })
        .sort({ created_at: -1 })
        .limit(limit);

      const formattedLogs = logs.map((log) => ({
        id: log._id,
        event: log.event,
        value: log.value,
        timestamp: log.created_at,
      }));

      res.json({
        success: true,
        logs: formattedLogs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
})

const aggUsage = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { range = "24h" } = req.query;

      const device = await Device.findOne({ _id: id, owner_id: req.user.id });
      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found or not authorized",
        });
      }

      let startTime = new Date();
      if (range.endsWith("h")) {
        const hours = parseInt(range.replace("h", ""), 10);
        startTime.setHours(startTime.getHours() - hours);
      } else if (range.endsWith("d")) {
        const days = parseInt(range.replace("d", ""), 10);
        startTime.setDate(startTime.getDate() - days);
      }

      const result = await Log.aggregate([
        {
          $match: {
            device_id: device._id,
            event: "units_consumed",
            created_at: { $gte: startTime },
          },
        },
        {
          $group: {
            _id: null,
            total_units: { $sum: "$value" },
          },
        },
      ]);

      const total_units = result.length > 0 ? result[0].total_units : 0;

      res.json({
        success: true,
        device_id: id,
        total_units_last: `${range}`,
        total_units,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
})

module.exports = { registerDevice, filterDevices, updateDevice, deleteDevice, updateLastActive, createLog, fetchLogs, aggUsage };
