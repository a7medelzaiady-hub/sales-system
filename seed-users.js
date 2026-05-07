import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createUsers() {
  await setDoc(doc(db, "users", "admin"), {
    pass: "1234",
    role: "admin"
  });

  await setDoc(doc(db, "users", "cashier1"), {
    pass: "1111",
    role: "cashier"
  });

  await setDoc(doc(db, "users", "ahmed"), {
    pass: "2222",
    role: "admin"
  });

  console.log("Users created ✅");
}

createUsers();
