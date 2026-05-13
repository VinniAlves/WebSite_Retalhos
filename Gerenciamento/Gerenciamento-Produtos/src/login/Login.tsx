import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export async function googleLogin() {
  const result = await signInWithPopup(auth, provider);
  const tokenFirebase = await result.user.getIdToken();

  const response = await fetch("http://localhost:3001/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tokenFirebase })
  });

  const data = await response.json();
  return data;
}