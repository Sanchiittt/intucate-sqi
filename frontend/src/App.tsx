import { useState } from "react";
import Login from "./components/Login";
import AdminConsole from "./components/AdminConsole";
import { isAuthenticated } from "./utils/auth";

function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  if (!auth) {
    return <Login onSuccess={() => setAuth(true)} />;
  }

  return <AdminConsole />;
}

export default App;
