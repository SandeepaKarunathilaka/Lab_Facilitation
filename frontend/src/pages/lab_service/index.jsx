import Button from "react-bootstrap/Button";
import { useMutation } from "@tanstack/react-query";
import { useLabServiceStore } from "../../store/useLabServiceStore";
import { useLabServiceData } from "../../hooks/useLabServiceData";
import { confirmMessage } from "../../utils/Alert";
import Toast from "../../utils/toast";
import LabServiceAPI from "../../api/LabServiceAPI";
import AddLabServiceModal from "./AddLabServiceModal";
import EditLabServiceModal from "./EditLabServiceModal";
import { BootstrapTable } from "../../components";
import { generatePDF } from "../../utils/GeneratePDF";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdEditSquare } from "react-icons/md";

const index = () => {
  // Get the state and actions from the store
  const {
    openAddLabServiceModal,
    openEditLabServiceModal,
    setSelectedLabService,
  } = useLabServiceStore((state) => ({
    openAddLabServiceModal: state.openAddLabServiceModal,
    openEditLabServiceModal: state.openEditLabServiceModal,
    setSelectedLabService: state.setSelectedLabService,
  }));

  // Get the data from the react-query hook
  const { data, refetch } = useLabServiceData();

  // Delete mutation
  const { mutate } = useMutation(LabServiceAPI.deleteLabService, {
    onSuccess: () => {
      refetch();
      Toast({ type: "success", message: "Lab Service deleted successfully" });
    },
    onError: (error) => {
      Toast({ type: "error", message: error?.response?.data?.message });
    },
  });

  // Delete function
  const onDelete = (id) => {
    confirmMessage("Are you sure?", "This action cannot be undone.", () => {
      mutate(id);
    });
  };

  // Edit function
  const handleEdit = (labService) => {
    setSelectedLabService(labService);
    openEditLabServiceModal();
  };

  // PDF report function
  const downloadPDF = () => {
    const labServiceCount = data.data.labServices.length;
    data.data.labServices.forEach((labService) => {
      labService.duration = `${labService.duration} min`;
      labService.preparationRequired = labService.preparationRequired
        ? "Yes"
        : "No";
      labService.price = `${labService.price} LKR`;
    });
    //
    const additionalInfo = `Total LabServices: ${labServiceCount}`;
    //
    generatePDF(
      additionalInfo,
      [
        "name",
        "description",
        "available",
        "duration",
        "preparationRequired",
        "price",
      ],
      data.data.labServices,
      "labServices-report"
    );
  };

  return (
    <div className="container mt-2">
      <AddLabServiceModal />
      <EditLabServiceModal />

      <h1 className="mb-4">Lab Services</h1>

      <Button
        variant="primary"
        className="m-1"
        onClick={openAddLabServiceModal}
      >
        <IoMdAddCircleOutline className="mb-1" /> <span>Add LabService</span>
      </Button>

      {/* Download PDF report */}
      <Button variant="success" className="m-1" onClick={downloadPDF}>
        <IoMdDownload className="mb-1" /> <span>Download Report</span>
      </Button>

      <div className="mt-5">
        <BootstrapTable
          headers={[
            "Name",
            "Description",
            "Available",
            "Duration",
            "Preparation Required",
            "Price",
            "Actions",
          ]}
          children={
            data &&
            data.data.labServices.map((labService) => (
              <tr key={labService._id}>
                <td>{labService.name}</td>
                <td>{labService.description}</td>
                <td>{labService.available ? "Yes" : "No"}</td>
                <td>{labService.duration}</td>
                <td>{labService.preparationRequired ? "Yes" : "No"}</td>
                <td>{labService.price}</td>
                <td className="d-flex">
                  <Button
                    className="mx-1 px-2"
                    variant="info"
                    onClick={() => handleEdit(labService)}
                    size="sm"
                  >
                    <MdEditSquare className="mb-1 mx-1" />
                  </Button>
                  <Button
                    className="mx-1 px-2 d-flex align-items-center"
                    variant="danger"
                    onClick={() => onDelete(labService._id)}
                    size="sm"
                  >
                    <AiTwotoneDelete className="mb-1 mx-1" />
                  </Button>
                </td>
              </tr>
            ))
          }
        />
      </div>
    </div>
  );
};

export default index;
