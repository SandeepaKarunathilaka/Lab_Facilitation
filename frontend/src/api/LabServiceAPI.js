import api from "./api";

class LabServiceAPI {
  // Create labService
  static createLabService(data) {
    return api.post("/api/labServices", data);
  }

  // Get all labServices
  static getLabServices() {
    return api.get("/api/labServices");
  }

  // Get labService by id
  static getLabServiceById(id) {
    return api.get(`/api/labServices/${id}`);
  }

  // Update labService
  static updateLabService(values) {
    const { id, data } = values;
    return api.patch(`/api/labServices/${id}`, data);
  }

  // Delete labService
  static deleteLabService(id) {
    return api.delete(`/api/labServices/${id}`);
  }

  // Get labServices count
  static getLabServicesCount() {
    return api.get("/api/labServices/count");
  }
}

export default LabServiceAPI;
