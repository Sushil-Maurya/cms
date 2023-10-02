import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (message, type = "info") => {
  switch (type) {
    case true:
      toast.success(message);
      break;
    case false:
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast.info(message);
      break;
  }
};

export const getTokenFromSessionStorage = () => {
  try {
    const token = sessionStorage.getItem("detail");
    return token;
  } catch (error) {
    console.error("Error retrieving token from session storage:", error);
    return null;
  }
};
