const LabService = require("../models/LabService");
const { z } = require("zod");

const createLabServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  available: z.boolean(),
  duration: z.number(),
  preparationRequired: z.boolean(),
  price: z.number(),
});

const labServiceController = {
  // create labService
  createLabService: async (req, res) => {
    try {
      const {
        name,
        description,
        available,
        duration,
        preparationRequired,
        price,
      } = req.body;

      // validation
      createLabServiceSchema.parse(req.body);

      const newLabService = new LabService({
        name,
        description,
        available,
        duration,
        preparationRequired,
        price,
      });

      const savedLabService = await newLabService.save();

      res.status(201).json({
        success: true,
        labService: savedLabService,
        message: "Lab Service created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // get all labServices
  getLabServices: async (req, res) => {
    try {
      const labServices = await LabService.find();

      res.status(200).json({ success: true, labServices });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // get labService by id
  getLabServiceById: async (req, res) => {
    try {
      const labServiceId = req.params.id;
      const labService = await LabService.findById(labServiceId);

      if (!labService) {
        return res.status(404).json({
          success: false,
          message: "Lab Service not found",
        });
      }

      res.status(200).json({ success: true, labService });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // update labService
  updateLabService: async (req, res) => {
    try {
      const labServiceId = req.params.id;
      const labService = await LabService.findById(labServiceId);

      if (!labService) {
        return res.status(404).json({
          success: false,
          message: "Lab Service not found",
        });
      }

      const updatedLabService = await LabService.findByIdAndUpdate(
        labServiceId,
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        labService: updatedLabService,
        message: "Lab Service updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // delete labService
  deleteLabService: async (req, res) => {
    try {
      const labServiceId = req.params.id;

      const labService = await LabService.findById(labServiceId);

      if (!labService) {
        return res.status(404).json({
          success: false,
          message: "Lab Service not found",
        });
      }

      const deletedLabService = await LabService.findByIdAndDelete(
        labServiceId
      );

      res.status(200).json({
        success: true,
        labService: deletedLabService,
        message: "Lab Service deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // get labServices count using aggregation
  getLabServicesCount: async (req, res) => {
    try {
      const labServicesCount = await LabService.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

      res
        .status(200)
        .json({ success: true, count: labServicesCount[0]?.count || 0 });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },
};

module.exports = labServiceController;
