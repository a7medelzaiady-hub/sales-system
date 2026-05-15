import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

window.deleteAllCustomers = async () => {
    console.log("بدأ الحذف...");

    const snap = await getDocs(collection(db, "customers"));

    console.log("عدد العملاء:", snap.size);

    for (const d of snap.docs) {
        await deleteDoc(doc(db, "customers", d.id));
        console.log("Deleted:", d.id);
    }

    console.log("تم حذف كل العملاء");
};
