import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function Ironing() {
  const [worker, setWorker] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [workers, setWorkers] = useState([]);

  const [entries, setEntries] = useState([]);

  const [items, setItems] = useState([
    {
      product: "",
      color: "",
      sentPieces: "",
      receivedPieces: "",
    },
  ]);

  const getWorkers = async () => {
    const q = query(
      collection(db, "workers"),
      where("department", "==", "Ironing"),
    );

    const querySnapshot = await getDocs(q);

    const arr = [];

    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setWorkers(arr);
  };

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "ironing"));

    const arr = [];

    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setEntries(arr);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    setItems(updatedItems);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        product: "",
        color: "",
        sentPieces: "",
        receivedPieces: "",
      },
    ]);
  };

  const removeRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);
  };

  const saveData = async () => {
    try {
      if (!worker) {
        alert("Select Worker");

        return;
      }

      await addDoc(collection(db, "ironing"), {
        worker,
        date: new Date(date),
        items,
      });

      alert("Ironing Entry Saved");

      setWorker("");

      setItems([
        {
          product: "",
          color: "",
          sentPieces: "",
          receivedPieces: "",
        },
      ]);

      getData();
    } catch (error) {
      console.log(error);

      alert("Error Saving");
    }
  };

  const deleteEntry = async (id) => {
    const confirmDelete = window.confirm("Delete this entry?");

    if (!confirmDelete) {
      return;
    }

    await deleteDoc(doc(db, "ironing", id));

    alert("Deleted");

    getData();
  };

  useEffect(() => {
    getWorkers();

    getData();
  }, []);

  const totalPantsSent = items

    .filter((item) => item.product.toLowerCase().includes("pant"))

    .reduce((sum, item) => {
      return sum + Number(item.sentPieces);
    }, 0);

  const totalPantsReceived = items

    .filter((item) => item.product.toLowerCase().includes("pant"))

    .reduce((sum, item) => {
      return sum + Number(item.receivedPieces);
    }, 0);

  const totalShirtsSent = items

    .filter((item) => item.product.toLowerCase().includes("shirt"))

    .reduce((sum, item) => {
      return sum + Number(item.sentPieces);
    }, 0);

  const totalShirtsReceived = items

    .filter((item) => item.product.toLowerCase().includes("shirt"))

    .reduce((sum, item) => {
      return sum + Number(item.receivedPieces);
    }, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-8">Ironing Entry</h1>

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
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-4 rounded-xl border"
        />

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Product"
              value={item.product}
              onChange={(e) =>
                handleItemChange(index, "product", e.target.value)
              }
              className="p-4 rounded-xl border"
            />

            <input
              type="text"
              placeholder="Color"
              value={item.color}
              onChange={(e) => handleItemChange(index, "color", e.target.value)}
              className="p-4 rounded-xl border"
            />

            <input
              type="number"
              placeholder="Sent Pieces"
              value={item.sentPieces}
              onChange={(e) =>
                handleItemChange(index, "sentPieces", e.target.value)
              }
              className="p-4 rounded-xl border"
            />

            <input
              type="number"
              placeholder="Received Pieces"
              value={item.receivedPieces}
              onChange={(e) =>
                handleItemChange(index, "receivedPieces", e.target.value)
              }
              className="p-4 rounded-xl border"
            />

            <button
              onClick={() => removeRow(index)}
              className="bg-red-500 text-white rounded-xl"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addRow}
          className="bg-blue-500 text-white p-4 rounded-xl"
        >
          Add More Items
        </button>

        <div className="bg-gray-100 p-5 rounded-xl">
          <p className="text-xl font-semibold">
            Total Pants Sent: {totalPantsSent}
          </p>

          <p className="text-xl font-semibold">
            Total Pants Received: {totalPantsReceived}
          </p>

          <p className="text-xl font-semibold">
            Total Pants Pending: {totalPantsSent - totalPantsReceived}
          </p>

          <hr className="my-3" />

          <p className="text-xl font-semibold">
            Total Shirts Sent: {totalShirtsSent}
          </p>

          <p className="text-xl font-semibold">
            Total Shirts Received: {totalShirtsReceived}
          </p>

          <p className="text-xl font-semibold">
            Total Shirts Pending: {totalShirtsSent - totalShirtsReceived}
          </p>
        </div>

        <button
          onClick={saveData}
          className="bg-black text-white p-4 rounded-xl text-xl"
        >
          Save Entry
        </button>
      </div>

      <div className="mt-10 bg-white p-5 rounded-2xl shadow-lg overflow-auto">
        <h2 className="text-2xl font-bold mb-5">Saved Ironing Entries</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Worker</th>

              <th className="p-3 border">Date</th>

              <th className="p-3 border">Items & Quantity</th>

              <th className="p-3 border">Total Pants Given</th>

              <th className="p-3 border">Total Shirts Given</th>

              <th className="p-3 border">Total Pants Received</th>

              <th className="p-3 border">Total Shirts Received</th>

              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => {
              const totalPantsGiven = entry.items

                ?.filter((item) => item.product.toLowerCase().includes("pant"))

                .reduce((sum, item) => {
                  return sum + Number(item.sentPieces);
                }, 0);

              const totalShirtsGiven = entry.items

                ?.filter((item) => item.product.toLowerCase().includes("shirt"))

                .reduce((sum, item) => {
                  return sum + Number(item.sentPieces);
                }, 0);

              const totalPantsReceived = entry.items

                ?.filter((item) => item.product.toLowerCase().includes("pant"))

                .reduce((sum, item) => {
                  return sum + Number(item.receivedPieces);
                }, 0);

              const totalShirtsReceived = entry.items

                ?.filter((item) => item.product.toLowerCase().includes("shirt"))

                .reduce((sum, item) => {
                  return sum + Number(item.receivedPieces);
                }, 0);

              return (
                <tr key={entry.id}>
                  <td className="p-3 border">{entry.worker}</td>

                  <td className="p-3 border">
                    {entry.date?.toDate
                      ? entry.date.toDate().toLocaleDateString("en-GB")
                      : ""}
                  </td>

                  <td className="p-3 border">
                    {entry.items?.map((item, index) => (
                      <span key={index}>
                        {item.color} {item.product}
                        {" - "}
                        {item.sentPieces}
                        {index !== entry.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>

                  <td className="p-3 border font-semibold">
                    {totalPantsGiven}
                  </td>

                  <td className="p-3 border font-semibold">
                    {totalShirtsGiven}
                  </td>

                  <td className="p-3 border font-semibold">
                    {totalPantsReceived}
                  </td>

                  <td className="p-3 border font-semibold">
                    {totalShirtsReceived}
                  </td>

                  <td className="p-3 border">
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ironing;
