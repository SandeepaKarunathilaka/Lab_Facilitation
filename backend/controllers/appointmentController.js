const Appointment = require("../models/Appointment");
const { z } = require("zod");
const sendEmail = require("../util/sendEmail");
const labReportReadyTemplate = require("../util/email_templates/labReportReadyTemplate");

const createAppointmentSchema = z.object({
  labService: z.string(),
  description: z.string(),
});

const appointmentController = {
  // create appointment
  createAppointment: async (req, res) => {
    try {
      const { labService, description } = req.body;
      const patient = req.userId;

      // validation
      createAppointmentSchema.parse(req.body);

      const newAppointment = new Appointment({
        labService,
        patient,
        description,
      });

      const savedAppointment = await newAppointment.save();

      res.status(201).json({
        success: true,
        appointment: savedAppointment,
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

  // get all appointments
  getAppointments: async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate("patient", "-password")
        .populate("labService");

      res.status(200).json({ success: true, appointments });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // get appointment by id
  getAppointmentById: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const appointment = await Appointment.findById(appointmentId)
        .populate("patient", "-password")
        .populate("labService");

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Lab Service not found",
        });
      }

      res.status(200).json({ success: true, appointment });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // update appointment
  updateAppointment: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Lab Service not found",
        });
      }

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        req.body,
        {
          new: true,
        }
      ).populate("patient", "-password");

      // if req.body.report is present, send an email to the patient
      if (req.body.report) {
        const { patient } = updatedAppointment;
        // send email
        const emailTemplate = labReportReadyTemplate(
          patient.name,
          req.body.report
        );
        //
        sendEmail(patient.email, "Lab Report Ready", emailTemplate);
      }

      res.status(200).json({
        success: true,
        appointment: updatedAppointment,
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

  // delete appointment
  deleteAppointment: async (req, res) => {
    try {
      const appointmentId = req.params.id;

      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Lab Service not found",
        });
      }

      const deletedAppointment = await Appointment.findByIdAndDelete(
        appointmentId
      );

      res.status(200).json({
        success: true,
        appointment: deletedAppointment,
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

  // get appointments count using aggregation
  getAppointmentsCount: async (req, res) => {
    try {
      const appointmentsCount = await Appointment.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

      res
        .status(200)
        .json({ success: true, count: appointmentsCount[0]?.count || 0 });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // get appointments for a patient
  getAppointmentsByPatient: async (req, res) => {
    try {
      const patientId = req.userId;

      const appointments = await Appointment.find({ patient: patientId })
        .populate("patient", "-password")
        .populate("labService");

      res.status(200).json({ success: true, appointments });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Internal server error",
      });
    }
  },

  // get appointments count for a patient
  getAppointmentsCountByPatient: async (req, res) => {
    try {
      const patientId = req.userId;

      const appointmentsCount = await Appointment.find({
        patient: patientId,
      }).countDocuments();

      res.status(200).json({ success: true, count: appointmentsCount });
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

module.exports = appointmentController;
