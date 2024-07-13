import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import FormControl from "react-bootstrap/FormControl";
import { useMutation } from "@tanstack/react-query";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import {
  useAppointmentData,
  useAppointmentsByPatient,
} from "../../hooks/useAppointmentData";
import { confirmMessage, successMessage } from "../../utils/Alert";
import Toast from "../../utils/toast";
import AppointmentAPI from "../../api/AppointmentAPI";
import AddAppointmentModal from "./AddAppointmentModal";
import EditAppointmentModal from "./EditAppointmentModal";
import { BootstrapTable } from "../../components";
import { generatePDF } from "../../utils/GeneratePDF";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdEditSquare } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";
import { USER_ROLES } from "../../constants/roles";
import { MdOutlinePayment } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { useState } from "react";

const index = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  // Get the state and actions from the store
  const {
    openAddAppointmentModal,
    openEditAppointmentModal,
    setSelectedAppointment,
  } = useAppointmentStore((state) => ({
    openAddAppointmentModal: state.openAddAppointmentModal,
    openEditAppointmentModal: state.openEditAppointmentModal,
    setSelectedAppointment: state.setSelectedAppointment,
  }));

  // Get the data from the react-query hook
  let result;
  if (user.role === USER_ROLES.ADMIN) {
    result = useAppointmentData();
  } else {
    result = useAppointmentsByPatient();
  }
  const { data, refetch } = result;

  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("name"); // 'name' or 'mobile'

  const filteredAppointments = data?.data?.appointments
    ? data.data.appointments.filter((appointment) => {
        if (filterBy === "name" && appointment.patient) {
          return appointment.patient.name
            .toLowerCase()
            .includes(search.toLowerCase());
        } else if (filterBy === "mobile" && appointment.patient) {
          return appointment.patient.mobile.includes(search);
        }
        return false;
      })
    : [];

  // Delete mutation
  const { mutate } = useMutation(AppointmentAPI.deleteAppointment, {
    onSuccess: () => {
      refetch();
      Toast({ type: "success", message: "Appointment deleted successfully" });
    },
    onError: (error) => {
      Toast({ type: "error", message: error?.response?.data?.message });
    },
  });

  // Status Update mutation
  const { mutate: updateStatus } = useMutation(
    AppointmentAPI.updateAppointment,
    {
      onSuccess: () => {
        refetch();
        successMessage("Payment successful", "Appointment status updated.");
      },
      onError: (error) => {
        Toast({ type: "error", message: error?.response?.data?.message });
      },
    }
  );

  // Delete function
  const onDelete = (id) => {
    confirmMessage("Are you sure?", "This action cannot be undone.", () => {
      mutate(id);
    });
  };

  // Edit function
  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    openEditAppointmentModal();
  };

  // PDF report function
  const downloadPDF = () => {
    const appointmentCount = data.data.appointments.length;
    data.data.appointments.forEach((appointment) => {
      appointment.labService = appointment.labService.name;
      appointment.mobile = appointment.patient.mobile;
      appointment.patient = appointment.patient.name;
      appointment.date = new Date(appointment.date).toDateString();
    });
    //
    const additionalInfo = `Total Appointments: ${appointmentCount}`;
    //
    generatePDF(
      additionalInfo,
      ["labService", "patient", "mobile", "date", "status"],
      data.data.appointments,
      "appointments-report"
    );
  };

  const adminColumns = [
    "Lab Service",
    "Description",
    "Patient",
    "Gender",
    "Mobile",
    "Date",
    "Status",
    "Actions",
  ];

  const patientColumns = [
    "Lab Service",
    "Description",
    "Date",
    "Status",
    "Amount",
    "Actions",
  ];

  return (
    <div className="container mt-2">
      <AddAppointmentModal />
      <EditAppointmentModal />

      <h1 className="mb-4">Appointments</h1>

      {user.role === USER_ROLES.ADMIN && (
        <div className="d-flex justify-content-between mb-3 gap-2">
          <Dropdown onSelect={(eventKey) => setFilterBy(eventKey)}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Filter by: {filterBy}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="name">Name</Dropdown.Item>
              <Dropdown.Item eventKey="mobile">Mobile</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <FormControl
            type="text"
            placeholder={`Search by ${filterBy}`}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {user.role === USER_ROLES.PATIENT && (
        <Button
          variant="primary"
          className="m-1"
          onClick={openAddAppointmentModal}
        >
          <IoMdAddCircleOutline className="mb-1" /> <span>Add Appointment</span>
        </Button>
      )}

      {/* Download PDF report */}
      <Button variant="success" className="m-1" onClick={downloadPDF}>
        <IoMdDownload className="mb-1" /> <span>Download Report</span>
      </Button>

      <div className="mt-3">
        <BootstrapTable
          headers={
            user.role === USER_ROLES.ADMIN ? adminColumns : patientColumns
          }
          children={filteredAppointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment?.labService?.name}</td>
              <td>{appointment.description}</td>
              {user.role === USER_ROLES.ADMIN && (
                <>
                  <td>{appointment?.patient?.name}</td>
                  <td>{appointment?.patient?.gender}</td>
                  <td>{appointment?.patient?.mobile}</td>
                </>
              )}
              {/* if date exists, show date */}
              <td>
                {new Date(appointment.date).toDateString() === "Invalid Date"
                  ? "Not assigned"
                  : new Date(appointment.date).toDateString()}
              </td>
              {/* status badge different colors */}
              <td>
                <span
                  className={`badge ${
                    appointment.status === "pending"
                      ? "bg-warning"
                      : appointment.status === "approved"
                      ? "bg-success"
                      : appointment.status === "inProgress"
                      ? "bg-primary"
                      : appointment.status === "completed"
                      ? "bg-secondary"
                      : "bg-danger"
                  }`}
                >
                  {appointment.status}
                </span>
              </td>
              {user.role === USER_ROLES.PATIENT && (
                <td>Rs.{appointment.labService.price}/=</td>
              )}

              <td className="d-flex">
                <Button
                  className="mx-1 px-2"
                  variant="info"
                  onClick={() => handleEdit(appointment)}
                  size="sm"
                >
                  <MdEditSquare className="mb-1 mx-1" />
                </Button>
                <Button
                  className="mx-1 px-2 d-flex align-items-center"
                  variant="danger"
                  onClick={() => onDelete(appointment._id)}
                  size="sm"
                >
                  <AiTwotoneDelete className="mb-1 mx-1" />
                </Button>
              </td>
            </tr>
          ))}
        />
      </div>
    </div>
  );
};

export default index;
