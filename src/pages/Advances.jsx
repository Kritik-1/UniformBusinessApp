import { useState, useEffect, useRef } from "react";

import SignatureCanvas from "react-signature-canvas";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function Advances() {
  const [worker, setWorker] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [workers, setWorkers] = useState([]);

  const [advances, setAdvances] = useState([]);

  const sigRef = useRef();

  const getWorkers = async () => {
    const querySnapshot = await getDocs(collection(db, "workers"));

    const arr = [];

    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setWorkers(arr);
  };

  const getAdvances = async () => {
    const querySnapshot = await getDocs(collection(db, "advances"));

    const arr = [];

    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setAdvances(arr);
  };

  const deleteAdvance = async (id) => {
    const confirmDelete = window.confirm("Delete this advance?");

    if (!confirmDelete) {
      return;
    }

    await deleteDoc(doc(db, "advances", id));

    alert("Advance Deleted");

    getAdvances();
  };

  const saveAdvance = async () => {
    try {
      if (!worker || !amount || !reason) {
        alert("Fill all fields");

        return;
      }

      if (sigRef.current.isEmpty()) {
        alert("Signature Required");

        return;
      }

      const signature = sigRef.current.getCanvas().toDataURL("image/png");

      await addDoc(collection(db, "advances"), {
        worker,
        amount,
        reason,
        date: new Date(date),
        signature,
      });

      alert("Advance Saved");

      setWorker("");
      setAmount("");
      setReason("");

      sigRef.current.clear();

      getAdvances();
    } catch (error) {
      console.log(error);

      alert("Error Saving Advance");
    }
  };

  useEffect(() => {
    getWorkers();

    getAdvances();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-8">Advances / Udhaar</h1>

      <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col gap-5">
        <select
          value={worker}
          onChange={(e) => setWorker(e.target.value)}
          className="p-4 rounded-xl border"
        >
          <option value="">Select Worker</option>

          {workers.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Advance Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-4 rounded-xl border"
        />

        <input
          type="text"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="p-4 rounded-xl border"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-4 rounded-xl border"
        />

        <div>
          <p className="mb-2 font-semibold">Worker Signature</p>

          <div className="border rounded-xl overflow-hidden">
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "bg-white",
              }}
              ref={sigRef}
            />
          </div>
        </div>

        <button
          onClick={() => sigRef.current.clear()}
          className="bg-gray-300 p-3 rounded-xl"
        >
          Clear Signature
        </button>

        <button
          onClick={saveAdvance}
          className="bg-black text-white p-4 rounded-xl text-xl"
        >
          Save Advance
        </button>
      </div>

      <div className="mt-10 bg-white p-5 rounded-2xl shadow-lg overflow-auto">
        <h2 className="text-2xl font-bold mb-5">Saved Advances</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Worker</th>

              <th className="p-3 border">Amount</th>

              <th className="p-3 border">Reason</th>

              <th className="p-3 border">Date</th>

              <th className="p-3 border">Signature</th>

              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {advances.map((item) => (
              <tr key={item.id}>
                <td className="p-3 border">{item.worker}</td>

                <td className="p-3 border">₹ {item.amount}</td>

                <td className="p-3 border">{item.reason}</td>

                <td className="p-3 border">
                  {item.date?.toDate
                    ? item.date.toDate().toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td className="p-3 border">
                  <img
                    src={item.signature}
                    alt="signature"
                    className="w-32 h-16 object-contain border rounded"
                  />
                </td>

                <td className="p-3 border">
                  <button
                    onClick={() => deleteAdvance(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Advances;
