import { useQuery } from "@tanstack/react-query";
import LabServiceAPI from "../api/LabServiceAPI";

export const useLabServiceData = () => {
  return useQuery(["labServices"], () => LabServiceAPI.getLabServices());
};

export const useLabServiceCount = () => {
  return useQuery(["labServiceCount"], () =>
    LabServiceAPI.getLabServicesCount()
  );
};

export const useLabService = (id) => {
  return useQuery(["labService", id], () =>
    LabServiceAPI.getLabServiceById(id)
  );
};
