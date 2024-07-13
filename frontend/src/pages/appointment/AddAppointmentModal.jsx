import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import {
  useAppointmentData,
  useAppointmentsByPatient,
} from "../../hooks/useAppointmentData";
import { BootstrapModal } from "../../components";
import AppointmentAPI from "../../api/AppointmentAPI";
import Toast from "../../utils/toast";
import { useLabServiceData } from "../../hooks/useLabServiceData";
import { USER_ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/useAuthStore";

const AddAppointmentModal = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  // Get the state and actions from the store
  const { isAddAppointmentModalOpen, closeAddAppointmentModal } =
    useAppointmentStore((state) => ({
      isAddAppointmentModalOpen: state.isAddAppointmentModalOpen,
      closeAddAppointmentModal: state.closeAddAppointmentModal,
    }));

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
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  // Create mutation
  const { mutate } = useMutation(AppointmentAPI.createAppointment, {
    onSuccess: () => {
      // close the modal and refetch the data
      closeAddAppointmentModal();
      refetch();
      Toast({ type: "success", message: "Appointment created successfully" });
    },
    onError: (error) => {
      Toast({ type: "error", message: error.message });
    },
  });

  // Submit function
  const onSubmit = (values) => {
    // call the mutation
    mutate(values);
    reset();
  };

  return (
    <BootstrapModal
      show={isAddAppointmentModalOpen}
      handleClose={closeAddAppointmentModal}
      title="Make an Appointment"
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {/* lab services dropdown */}
        <div className="mb-3">
          <label htmlFor="labService" className="form-label">
            Lab Service
          </label>
          <select
            className="form-select"
            id="labService"
            {...register("labService", { required: true })}
          >
            <option value="">Select a lab service</option>
            {labServices?.data?.labServices
              .filter((service) => service.available)
              .map((labService) => (
                <option key={labService._id} value={labService._id}>
                  {labService.name}
                </option>
              ))}
          </select>
          {errors.labService && (
            <span className="text-danger">This field is required</span>
          )}
        </div>

        {/* description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            {...register("description", { required: true })}
          ></textarea>
          {errors.description && (
            <span className="text-danger">This field is required</span>
          )}
        </div>

        {/* <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            {...register("date", { required: true })}
          />
          {errors.date && (
            <span className="text-danger">This field is required</span>
          )}
        </div> */}

        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </BootstrapModal>
  );
};

export default AddAppointmentModal;
