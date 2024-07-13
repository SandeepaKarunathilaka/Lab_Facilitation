import React from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useLabServiceCount } from "../../../hooks/useLabServiceData";
import { useAppointmentData } from "../../../hooks/useAppointmentData";

const index = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  // Get the data from the react-query hook
  const { data: labServiceCount } = useLabServiceCount();
  const { data: appointments } = useAppointmentData();
  //
  // "pending", "approved", "inProgress", "completed", "cancelled"]
  const pendingAppointmentsCount = appointments?.data?.appointments?.filter(
    (appointment) => appointment.status === "pending"
  ).length;
  const approvedAppointmentsCount = appointments?.data?.appointments?.filter(
    (appointment) => appointment.status === "approved"
  ).length;
  const inProgressAppointmentsCount = appointments?.data?.appointments?.filter(
    (appointment) => appointment.status === "inProgress"
  ).length;
  const completedAppointmentsCount = appointments?.data?.appointments?.filter(
    (appointment) => appointment.status === "completed"
  ).length;
  const cancelledAppointmentsCount = appointments?.data?.appointments?.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;
  //
  return (
    <div className="container mt-4">
      {user && (
        <div className="alert alert-primary" role="alert">
          You are logged in as <strong>{user.role}</strong>
        </div>
      )}

      <div className="row">
        <h2 className="mb-3">
          {/* greeting message based on the time of the day */}
          {new Date().getHours() < 12
            ? "Good Morning"
            : new Date().getHours() < 18
            ? "Good Afternoon"
            : "Good Evening"}
          , {user && user.name}
        </h2>
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">🔬 Total Lab Services</h5>
              <p className="card-text fs-4 fw-bold">
                {labServiceCount ? labServiceCount?.data?.count : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">🕒 Pending Appointments</h5>
              <p className="card-text fs-4 fw-bold">
                {/* filter the appointments with status "pending" and show the count */}
                {pendingAppointmentsCount ? pendingAppointmentsCount : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">✅ Approved Appointments</h5>
              <p className="card-text fs-4 fw-bold">
                {/* filter the appointments with status "pending" and show the count */}
                {approvedAppointmentsCount ? approvedAppointmentsCount : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">🔄 In Progress Appointments</h5>
              <p className="card-text fs-4 fw-bold">
                {/* filter the appointments with status "pending" and show the count */}
                {inProgressAppointmentsCount ? inProgressAppointmentsCount : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">🎉 Completed Appointments</h5>
              <p className="card-text fs-4 fw-bold">
                {/* filter the appointments with status "pending" and show the count */}
                {completedAppointmentsCount ? completedAppointmentsCount : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">🚫 Cancelled Appointments</h5>
              <p className="card-text fs-4 fw-bold">
                {/* filter the appointments with status "pending" and show the count */}
                {cancelledAppointmentsCount ? cancelledAppointmentsCount : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
