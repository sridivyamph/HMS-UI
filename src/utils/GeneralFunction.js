///  STORE TOKEN AND ROLE

export const handleAuthTokens = (jwtToken) => {
  if (!jwtToken) {
    console.error("No JWT token provided to storeTokensAndRole");
    return;
  }

  try {
    const tokenObject = typeof jwtToken === 'string' ? JSON.parse(jwtToken) : jwtToken;
    const accessToken = tokenObject.access_token;
    const refreshToken = tokenObject.refresh_token;

    if (!accessToken) {
      console.error("No access_token found in JWT token object");
      return;
    }

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    // Decode JWT payload
    const base64payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(base64payload));

    const roles = decodedPayload?.realm_access?.roles || [];
    const allowedRoles = [
      "PATIENT",
      "ADMIN",
      "RECEPTIONIST",
      "DOCTOR",
      "LAB-TECHNICIAN",
    ];

    // Find first matching role (case-insensitive)
    const userRole = roles.find((role) =>
      allowedRoles.includes(role.toUpperCase())
    );

    if (userRole) {
      localStorage.setItem("user_role", userRole.toUpperCase());
    } else {
      console.warn("No matching allowed role found in token payload:", roles);
    }
  } catch (error) {
    console.error("Failed to process tokens", error);
  }
};
