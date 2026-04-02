import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="565523414137-8qmvm7ft50ov21fm1d88u3h8gf416591.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);