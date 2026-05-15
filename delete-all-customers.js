import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAS0NNcZ1o-TL2nWCB7p0941jR0bo-MNls",
  authDomain: "ahmedelzaiady.firebaseapp.com",
  projectId: "ahmedelzaiady",
  storageBucket: "ahmedelzaiady.firebasestorage.app",
  messagingSenderId: "300306825071",
  appId: "1:300306825071:web:0426ddde56280fa090329a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllCustomers() {
  try {
    const snap = await getDocs(collection(db, "customers"));

    if (snap.empty) {
      console.log("لا يوجد عملاء للحذف");
      return;
    }

    for (const d of snap.docs) {
      await deleteDoc(doc(db, "customers", d.id));
      console.log("Deleted:", d.id);
    }

    console.log("تم حذف جميع العملاء نهائياً");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

deleteAllCustomers();
