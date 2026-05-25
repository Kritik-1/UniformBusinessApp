import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import StitchingForm from "../components/StitchingForm";
import StitchingTable from "../components/StitchingTable";

function Stitching() {
  const [worker, setWorker] = useState("");
  const [product, setProduct] = useState("");
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState("");
  const [pieces, setPieces] = useState("");
  const [rate, setRate] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [entries, setEntries] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getWorkers = async () => {
    const q = query(
      collection(db, "workers"),
      where("department", "==", "Stitching"),
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
    const querySnapshot = await getDocs(collection(db, "stitching"));

    const arr = [];

    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setEntries(arr);
  };

  const editEntry = (item) => {
    setEditId(item.id);

    setWorker(item.worker);
    setProduct(item.product);
    setColor(item.color);
    setSizes(item.sizes);
    setPieces(item.pieces);
    setRate(item.rate);
    setDate(
      item.date?.toDate ? item.date.toDate().toISOString().split("T")[0] : "",
    );
  };

  const deleteEntry = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?",
    );

    if (!confirmDelete) {
      return;
    }

    await deleteDoc(doc(db, "stitching", id));

    alert("Entry Deleted");

    getData();
  };

  const updateStatus = async (id, newStatus) => {
    const ref = doc(db, "stitching", id);

    await updateDoc(ref, {
      status: newStatus,
    });

    getData();
  };

  const saveData = async () => {
    try {
      if (editId) {
        const ref = doc(db, "stitching", editId);

        await updateDoc(ref, {
          worker,
          product,
          color,
          sizes,
          pieces,
          rate,
        });

        alert("Entry Updated");

        setEditId(null);

        getData();
      } else {
        await addDoc(collection(db, "stitching"), {
          worker,
          product,
          color,
          sizes,
          pieces,
          rate,
          status: "Given",
          date: new Date(date),
        });

        alert("Data Saved Successfully");

        getData();
      }

      setWorker("");
      setProduct("");
      setColor("");
      setSizes("");
      setPieces("");
      setRate("");
    } catch (error) {
      console.log(error);

      alert("Error Saving Data");
    }
  };

  useEffect(() => {
    getData();

    getWorkers();
  }, []);

  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      item.worker?.toLowerCase().includes(search.toLowerCase()) ||
      item.product?.toLowerCase().includes(search.toLowerCase()) ||
      item.sizes?.toLowerCase().includes(search.toLowerCase());

    if (!item.date) {
      return matchesSearch;
    }

    const itemDate = item.date.toDate
      ? item.date.toDate()
      : new Date(item.date);

    const from = fromDate ? new Date(fromDate) : null;

    const to = toDate ? new Date(toDate) : null;

    let matchesDate = true;

    if (from && itemDate < from) {
      matchesDate = false;
    }

    if (to && itemDate > to) {
      matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-8">Stitching Entry</h1>

      <StitchingForm
        worker={worker}
        setWorker={setWorker}
        product={product}
        setProduct={setProduct}
        color={color}
        setColor={setColor}
        sizes={sizes}
        setSizes={setSizes}
        pieces={pieces}
        setPieces={setPieces}
        rate={rate}
        setRate={setRate}
        date={date}
        setDate={setDate}
        saveData={saveData}
        workers={workers}
        editId={editId}
      />

      <input
        type="text"
        placeholder="Search by worker, product or size"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 rounded-2xl border mb-5"
      />

      <div className="grid grid-cols-2 gap-5 mb-5">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="p-4 rounded-2xl border"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="p-4 rounded-2xl border"
        />
      </div>

      <StitchingTable
        entries={filteredEntries}
        updateStatus={updateStatus}
        editEntry={editEntry}
        deleteEntry={deleteEntry}
      />
    </div>
  );
}

export default Stitching;
