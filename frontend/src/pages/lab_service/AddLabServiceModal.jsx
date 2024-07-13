import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLabServiceStore } from "../../store/useLabServiceStore";
import { useLabServiceData } from "../../hooks/useLabServiceData";
import { BootstrapModal } from "../../components";
import LabServiceAPI from "../../api/LabServiceAPI";
import Toast from "../../utils/toast";

const AddLabServiceModal = () => {
  // Get the state and actions from the store
  const { isAddLabServiceModalOpen, closeAddLabServiceModal } =
    useLabServiceStore((state) => ({
      isAddLabServiceModalOpen: state.isAddLabServiceModalOpen,
      closeAddLabServiceModal: state.closeAddLabServiceModal,
    }));

  // Get refetch function from react-query hook
  const { refetch } = useLabServiceData();

  // React hook form setup
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  // Create mutation
  const { mutate } = useMutation(LabServiceAPI.createLabService, {
    onSuccess: () => {
      // close the modal and refetch the data
      closeAddLabServiceModal();
      refetch();
      Toast({ type: "success", message: "LabService created successfully" });
    },
    onError: (error) => {
      Toast({ type: "error", message: error.message });
    },
  });

  // Submit function
  const onSubmit = (values) => {
    // convert duration and price to numbers
    values.duration = Number(values.duration);
    values.price = Number(values.price);

    // convert available and preparationRequired to boolean
    values.available = values.available === "true";
    values.preparationRequired = values.preparationRequired === "true";

    // call the mutation
    mutate(values);
    reset();
  };

  return (
    <BootstrapModal
      show={isAddLabServiceModalOpen}
      handleClose={closeAddLabServiceModal}
      title="Add LabService"
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="form-group">
          <label className="my-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <small className="form-text text-danger">Name is required</small>
          )}
        </div>

        <div className="form-group">
          <label className="my-2" htmlFor="description">
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

        {/* Duration and Price Side by Side */}
        <div className="row">
          <div className="form-group col-md-6">
            <label className="my-2" htmlFor="duration">
              Duration (min)
            </label>
            <input
              type="number"
              className="form-control"
              id="duration"
              name="duration"
              {...register("duration", { required: true })}
            />
            {errors.duration && (
              <small className="form-text text-danger">
                Duration is required
              </small>
            )}
          </div>

          <div className="form-group col-md-6">
            <label className="my-2" htmlFor="price">
              Price (LKR)
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              {...register("price", { required: true })}
            />
            {errors.price && (
              <small className="form-text text-danger">Price is required</small>
            )}
          </div>
        </div>

        {/* Available and Preparation Required Side by Side */}
        <div className="row">
          <div className="form-group col-md-6">
            <label className="my-2" htmlFor="available">
              Available
            </label>
            <select
              className="form-control"
              id="available"
              name="available"
              {...register("available", { required: true })}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {errors.available && (
              <small className="form-text text-danger">
                Available is required
              </small>
            )}
          </div>

          <div className="form-group col-md-6">
            <label className="my-2" htmlFor="preparationRequired">
              Preparation Required
            </label>
            <select
              className="form-control"
              id="preparationRequired"
              name="preparationRequired"
              {...register("preparationRequired", { required: true })}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {errors.preparationRequired && (
              <small className="form-text text-danger">
                Preparation Required is required
              </small>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </BootstrapModal>
  );
};

export default AddLabServiceModal;
