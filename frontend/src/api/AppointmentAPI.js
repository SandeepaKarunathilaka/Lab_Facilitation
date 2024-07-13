import api from "./api";

class AppointmentAPI {
  // Create appointment
  static createAppointment(data) {
    return api.post("/api/appointments", data);
  }

  // Get all appointments
  static getAppointments() {
    return api.get("/api/appointments");
  }

  // Get appointment by id
  static getAppointmentById(id) {
    return api.get(`/api/appointments/${id}`);
  }

  // Update appointment
  static updateAppointment(values) {
    const { id, data } = values;
    return api.patch(`/api/appointments/${id}`, data);
  }

  // Delete appointment
  static deleteAppointment(id) {
    return api.delete(`/api/appointments/${id}`);
  }

  // Get appointments count
  static getAppointmentsCount() {
    return api.get("/api/appointments/count");
  }

  // Get appointments by patient
  static getAppointmentsByPatient() {
    return api.get("/api/appointments/patient");
  }

  // Get appointments count by patient
  static getAppointmentsCountByPatient() {
    return api.get("/api/appointments/patient/count");
  }
}

export default AppointmentAPI;
