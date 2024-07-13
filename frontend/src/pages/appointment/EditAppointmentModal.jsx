import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import {
  useAppointmentData,
  useAppointmentsByPatient,
} from "../../hooks/useAppointmentData";
import { BootstrapModal } from "../../components";
import Toast from "../../utils/toast";
import AppointmentAPI from "../../api/AppointmentAPI";
import { USER_ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/useAuthStore";
import { useLabServiceData } from "../../hooks/useLabServiceData";
import { handleUpload } from "../../utils/HandleUpload";

const EditAppointmentModal = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  // Get the state and actions from the store
  const {
    isEditAppointmentModalOpen,
    closeEditAppointmentModal,
    selectedAppointment,
  } = useAppointmentStore((state) => ({
    isEditAppointmentModalOpen: state.isEditAppointmentModalOpen,
    closeEditAppointmentModal: state.closeEditAppointmentModal,
    selectedAppointment: state.selectedAppointment,
  }));

  const [document, setDocument] = useState("");
  const [documentFile, setDocumentFile] = useState("");
  const [documentPercent, setDocumentPercent] = useState(0);

  // Handle document upload
  const handleDocumentUpload = (e) => {
    // const file = e.target.files[0];
    setDocumentFile(documentFile);
    handleUpload({
      file: documentFile,
      setPercent: setDocumentPercent,
      setFunc: setDocument,
    });
  };

  // Handle document change
  function handleDocumentChange(event) {
    setDocumentFile(event.target.files[0]);
  }

  // Get refetch function from react-query hook
  let result;
  if (user.role === USER_ROLES.ADMIN) {
    result = useAppointmentData();
  } else {
    result = useAppointmentsByPatient();
  }
  const { refetch } = result;

  const { data: labServices } = useLabServiceData();

  // React hook form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Update mutation
  const { mutate } = useMutation(AppointmentAPI.updateAppointment, {
    onSuccess: () => {
      // reset the percent and image state
      setDocumentPercent(0);
      setDocument("");
      // close the modal and refetch the data
      refetch();
      closeEditAppointmentModal();
      Toast({ type: "success", message: "Appointment updated successfully" });
    },
  });

  // Submit function
  const onSubmit = (data) => {
    if (!selectedAppointment.report) {
      data.report = document;
    }
    //
    mutate({ id: selectedAppointment._id, data });
    reset();
    //
    setDocumentPercent(0);
    setDocument("");
  };

  useEffect(() => {
    // Set the form values when the selectedAppointment changes
    if (selectedAppointment) {
      setValue("date", selectedAppointment.date);
      setValue("status", selectedAppointment.status);
      setValue("labService", selectedAppointment.labService._id);
      setValue("description", selectedAppointment.description);
      setDocument(selectedAppointment.report);
    }
  }, [selectedAppointment, setValue]);

  return (
    <BootstrapModal
      show={isEditAppointmentModalOpen}
      handleClose={closeEditAppointmentModal}
      title={`Edit: ${selectedAppointment?.patient?.name}'s Appointment`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* labService */}
        <div className="mb-2">
          <label htmlFor="labService" className="form-label">
            Lab Service
          </label>
          <select
            className="form-select"
            id="labService"
            name="labService"
            {...register("labService", { required: true })}
          >
            {labServices?.data?.labServices?.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.labService && (
            <small className="form-text text-danger">
              Lab Service is required
            </small>
          )}
        </div>

        {/* description */}
        <div className="mb-2">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            {...register("description", { required: true })}
          ></textarea>
          {errors.description && (
            <small className="form-text text-danger">
              Description is required
            </small>
          )}
        </div>

        {user.role === USER_ROLES.ADMIN && (
          <>
            {/* date */}
            <div className="mb-2">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                {...register("date", { required: true })}
              />
              {errors.date && (
                <small className="form-text text-danger">
                  Date is required
                </small>
              )}
            </div>

            {/* status */}
            <div className="mb-2">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                {...register("status", { required: true })}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <small className="form-text text-danger">
                  Status is required
                </small>
              )}
            </div>

            <hr />

            <div className="form-group">
              <label className="mb-2" htmlFor="document">
                {selectedAppointment?.report ? (
                  <span className="badge bg-success">
                    Report already sent to patient
                  </span>
                ) : document ? (
                  <span className="badge bg-warning">
                    Report selected for send - click save to send
                  </span>
                ) : (
                  <span className="badge bg-primary">
                    Select a report to send to patient
                  </span>
                )}
              </label>
              <input
                type="file"
                className="form-control"
                id="document"
                placeholder="Upload document"
                onChange={handleDocumentChange}
              />
              <button
                type="button"
                onClick={handleDocumentUpload}
                disabled={!documentFile || documentPercent === 100}
                // add suitable color to the button
                className="btn btn-outline-dark mt-2 btn-sm"
              >
                Upload
              </button>
              <div className="progress mt-2">
                <div
                  className={`progress-bar bg-success ${
                    documentPercent < 100
                      ? "progress-bar-animated progress-bar-striped"
                      : ""
                  }`}
                  role="progressbar"
                  style={{ width: `${documentPercent}%` }}
                  aria-valuenow={documentPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {documentPercent < 100
                    ? `Uploading ${documentPercent}%`
                    : `Uploaded ${documentPercent}%`}
                </div>
              </div>
            </div>
            <hr />
          </>
        )}

        {/* submit button */}
        <button type="submit" className="btn btn-primary mt-2">
          Save
        </button>
      </form>
    </BootstrapModal>
  );
};

export default EditAppointmentModal;
