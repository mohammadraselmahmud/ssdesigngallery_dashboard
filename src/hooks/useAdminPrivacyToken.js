import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function useAdminPrivacyToken() {
  const adminPrivacyToken = Cookies.get("adminPrivacyToken", { path: "/" });

  // Check if the token validity expired
  const getAdminPrivacyToken = () => {
    if (
      adminPrivacyToken &&
      Date.now() > jwtDecode(adminPrivacyToken)?.exp * 1000
    ) {
      Cookies.remove("adminPrivacyToken", { path: "/" });
      return null;
    }

    return adminPrivacyToken;
  };

  const handleRemoveToken = () => {
    Cookies.remove("adminPrivacyToken", { path: "/" });
  };

  return { getAdminPrivacyToken, handleRemoveToken };
}
