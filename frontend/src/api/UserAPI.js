import api from "./api";

class UserAPI {
  // Get all users
  static getUsers() {
    return api.post("/api/users");
  }
}

export default UserAPI;
