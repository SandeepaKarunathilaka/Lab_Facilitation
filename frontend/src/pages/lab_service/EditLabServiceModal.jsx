import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLabServiceStore } from "../../store/useLabServiceStore";
import { useLabServiceData } from "../../hooks/useLabServiceData";
import { BootstrapModal } from "../../components";
import Toast from "../../utils/toast";
import LabServiceAPI from "../../api/LabServiceAPI";

const EditLabServiceModal = () => {
  // Get the state and actions from the store
  const {
    isEditLabServiceModalOpen,
    closeEditLabServiceModal,
    selectedLabService,
  } = useLabServiceStore((state) => ({
    isEditLabServiceModalOpen: state.isEditLabServiceModalOpen,
    closeEditLabServiceModal: state.closeEditLabServiceModal,
    selectedLabService: state.selectedLabService,
  }));

  // Get refetch function from react-query hook
  const { refetch } = useLabServiceData();

  // React hook form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Update mutation
  const { mutate } = useMutation(LabServiceAPI.updateLabService, {
    onSuccess: () => {
      // close the modal and refetch the data
      refetch();
      closeEditLabServiceModal();
      Toast({ type: "success", message: "LabService updated successfully" });
    },
  });

  // Submit function
  const onSubmit = (data) => {
    mutate({ id: selectedLabService._id, data });
  };

  useEffect(() => {
    // Set the form values when the selectedLabService changes
    if (selectedLabService) {
      setValue("name", selectedLabService.name);
      setValue("description", selectedLabService.description);
      setValue("available", selectedLabService.available.toString());
      setValue("duration", selectedLabService.duration.toString());
      setValue(
        "preparationRequired",
        selectedLabService.preparationRequired.toString()
      );
      setValue("price", selectedLabService.price.toString());
    }
  }, [selectedLabService, setValue]);

  return (
    <BootstrapModal
      show={isEditLabServiceModalOpen}
      handleClose={closeEditLabServiceModal}
      title={`Edit: ${selectedLabService?.name}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label htmlFor="name" className="form-label">
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

        {/* Duration and Price Side by Side */}
        <div className="row">
          <div className="col-md-6 mb-2">
            <label htmlFor="duration" className="form-label">
              Duration (in minutes)
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

          <div className="col-md-6 mb-2">
            <label htmlFor="price" className="form-label">
              Price
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

        {/* Available and Preparation Required side by side */}
        <div className="row">
          <div className="col-md-6 mb-2">
            <label htmlFor="available" className="form-label">
              Available
            </label>
            <select
              className="form-select"
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

          <div className="col-md-6 mb-2">
            <label htmlFor="preparationRequired" className="form-label">
              Preparation Required
            </label>
            <select
              className="form-select"
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
          Save
        </button>
      </form>
    </BootstrapModal>
  );
};

export default EditLabServiceModal;
