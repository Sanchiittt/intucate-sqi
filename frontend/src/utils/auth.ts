export function login(email: string, password: string): boolean {
  if (
    email.endsWith("@intucate.com") &&
    password.length >= 8
  ) {
    localStorage.setItem("auth", "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("auth");
}

export function isAuthenticated(): boolean {
  return localStorage.getItem("auth") === "true";
}
