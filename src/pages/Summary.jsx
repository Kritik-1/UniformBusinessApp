import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebase";

function Summary() {
  const [entries, setEntries] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [turpaiEntries, setTurpaiEntries] = useState([]);
  const [ironingEntries, setIroningEntries] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedModule, setSelectedModule] = useState("stitching");

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

  const getTurpai = async () => {
    const querySnapshot = await getDocs(collection(db, "turpai"));

    const arr = [];

    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setTurpaiEntries(arr);
  };

  const getIroning = async () => {
    const querySnapshot = await getDocs(collection(db, "ironing"));

    const arr = [];

    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setIroningEntries(arr);
  };

  useEffect(() => {
    getData();

    getAdvances();

    getTurpai();

    getIroning();
  }, []);

  const workerTotals = {};

  entries
    .filter((item) => {
      if (!item.date) return true;

      const itemDate = item.date.toDate();

      const from = fromDate ? new Date(fromDate) : null;

      const to = toDate ? new Date(toDate) : null;

      if (from && itemDate < from) {
        return false;
      }

      if (to && itemDate > to) {
        return false;
      }

      return true;
    })

    .forEach((item) => {
      const worker = item.worker;

      const pieces = Number(item.pieces);
      const rate = Number(item.rate);

      const total = pieces * rate;

      if (!workerTotals[worker]) {
        workerTotals[worker] = {
          pieces: 0,
          workAmount: 0,
          advanceAmount: 0,
          finalBalance: 0,
        };
      }

      workerTotals[worker].pieces += pieces;

      workerTotals[worker].workAmount += total;
    });

  advances.forEach((item) => {
    const worker = item.worker;

    const amount = Number(item.amount);

    if (!workerTotals[worker]) {
      workerTotals[worker] = {
        pieces: 0,
        workAmount: 0,
        advanceAmount: 0,
        finalBalance: 0,
      };
    }

    workerTotals[worker].advanceAmount += amount;
  });

  Object.keys(workerTotals).forEach((worker) => {
    workerTotals[worker].finalBalance =
      workerTotals[worker].workAmount - workerTotals[worker].advanceAmount;
  });

  const generatePDF = () => {
    if (!selectedWorker) {
      alert("Select Worker");

      return;
    }

    const doc = new jsPDF();

    let currentEntries = entries;

    if (selectedModule === "turpai") {
      currentEntries = turpaiEntries;
    }

    if (selectedModule === "ironing") {
      currentEntries = ironingEntries;
    }

    const filteredWorkerEntries = currentEntries.filter((item) => {
      if (item.worker !== selectedWorker) {
        return false;
      }

      if (!item.date) {
        return false;
      }

      const itemDate = item.date.toDate();

      const from = fromDate ? new Date(fromDate) : null;

      const to = toDate ? new Date(toDate) : null;

      if (from && itemDate < from) {
        return false;
      }

      if (to && itemDate > to) {
        return false;
      }

      return true;
    });

    let totalAmount = 0;

    let totalSent = 0;
    let totalReturned = 0;
    let totalPending = 0;

    const tableRows = filteredWorkerEntries.map((item) => {
      if (selectedModule === "stitching") {
        const total = Number(item.pieces) * Number(item.rate);

        totalAmount += total;

        return [
          item.date?.toDate ? item.date.toDate().toLocaleDateString("en-GB") : "",

          item.product,

          item.color,

          item.sizes,

          item.pieces,

          `₹ ${item.rate}`,

          `₹ ${total}`,
        ];
      }

      if (selectedModule === "turpai") {
        totalSent += Number(item.sentPieces);

        totalReturned += Number(item.returnedPieces);

        totalPending += Number(item.pendingPieces);

        return [
          item.date?.toDate ? item.date.toDate().toLocaleDateString("en-GB") : "",

          item.product,

          item.color,

          item.sentPieces,

          item.returnedPieces,

          item.pendingPieces,
        ];
      }

      const totalPantsGiven = item.items

        ?.filter((x) => x.product.toLowerCase().includes("pant"))

        .reduce((sum, x) => {
          return sum + Number(x.sentPieces);
        }, 0);

      const totalShirtsGiven = item.items

        ?.filter((x) => x.product.toLowerCase().includes("shirt"))

        .reduce((sum, x) => {
          return sum + Number(x.sentPieces);
        }, 0);

      const totalPantsReceived = item.items

        ?.filter((x) => x.product.toLowerCase().includes("pant"))

        .reduce((sum, x) => {
          return sum + Number(x.receivedPieces);
        }, 0);

      const totalShirtsReceived = item.items

        ?.filter((x) => x.product.toLowerCase().includes("shirt"))

        .reduce((sum, x) => {
          return sum + Number(x.receivedPieces);
        }, 0);

      totalSent += totalPantsGiven + totalShirtsGiven;

      totalReturned += totalPantsReceived + totalShirtsReceived;

      totalPending +=
        totalPantsGiven -
        totalPantsReceived +
        (totalShirtsGiven - totalShirtsReceived);

      return [
        item.date?.toDate ? item.date.toDate().toLocaleDateString("en-GB") : "",

        item.items

          ?.map((x) => `${x.color} ${x.product} - ${x.sentPieces}`)

          .join(", "),

        totalPantsGiven,

        totalShirtsGiven,

        totalPantsReceived,

        totalShirtsReceived,
      ];
    });

    doc.setFontSize(18);

    doc.text(`${selectedModule.toUpperCase()} Report`, 14, 20);

    doc.setFontSize(12);

    doc.text(`Worker: ${selectedWorker}`, 14, 35);

    doc.text(`From: ${fromDate}`, 14, 45);

    doc.text(`To: ${toDate}`, 14, 55);

    autoTable(doc, {
      startY: 70,

      head: [
        [
          ...(selectedModule === "stitching"
            ? ["Date", "Product", "Color", "Size", "Pieces", "Rate", "Total"]
            : selectedModule === "turpai"
              ? ["Date", "Product", "Color", "Sent", "Returned", "Pending"]
              : [
                  "Date",
                  "Items & Qty",
                  "Total Pants Given",
                  "Total Shirts Given",
                  "Total Pants Received",
                  "Total Shirts Received",
                ]),
        ],
      ],

      body: tableRows,
    });

    const finalY = doc.lastAutoTable.finalY + 20;

    if (selectedModule === "stitching") {
      const workerAdvance = advances

        .filter((item) => {
          if (item.worker !== selectedWorker) {
            return false;
          }

          return true;
        })

        .reduce((sum, item) => {
          return sum + Number(item.amount);
        }, 0);

      const finalBalance = totalAmount - workerAdvance;

      doc.text(`Total Work Amount: ₹ ${totalAmount}`, 14, finalY);

      doc.text(`Advance Taken: ₹ ${workerAdvance}`, 14, finalY + 10);

      doc.text(`Final Balance: ₹ ${finalBalance}`, 14, finalY + 20);
    } else {
      doc.text(`Total Sent: ${totalSent}`, 14, finalY);

      doc.text(`Total Returned: ${totalReturned}`, 14, finalY + 10);

      doc.text(`Total Pending: ${totalPending}`, 14, finalY + 20);
    }

    const fileName = `${fromDate}_to_${toDate}_${selectedWorker}_${selectedModule}.pdf`;

    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-8">Worker Summary</h1>

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

      <select
        value={selectedModule}
        onChange={(e) => setSelectedModule(e.target.value)}
        className="p-4 rounded-2xl border mb-5 w-full"
      >
        <option value="stitching">Stitching</option>

        <option value="turpai">Turpai</option>

        <option value="ironing">Ironing</option>
      </select>

      <select
        value={selectedWorker}
        onChange={(e) => setSelectedWorker(e.target.value)}
        className="p-4 rounded-2xl border mb-5 w-full"
      >
        <option value="">Select Worker</option>

        {(selectedModule === "stitching"
          ? entries
          : selectedModule === "turpai"
            ? turpaiEntries
            : ironingEntries
        )

          .map((item) => item.worker)

          .filter((value, index, self) => self.indexOf(value) === index)

          .map((worker) => (
            <option key={worker} value={worker}>
              {worker}
            </option>
          ))}
      </select>

      <button
        onClick={generatePDF}
        className="bg-black text-white px-6 py-3 rounded-xl mb-5"
      >
        Generate PDF Report
      </button>

      <div className="bg-white p-5 rounded-2xl shadow-lg overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Worker</th>

              <th className="p-3 border">Total Pieces</th>

              <th className="p-3 border">Work Amount</th>

              <th className="p-3 border">Advance</th>

              <th className="p-3 border">Final Balance</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(workerTotals).map((worker) => (
              <tr key={worker}>
                <td className="p-3 border">{worker}</td>

                <td className="p-3 border">{workerTotals[worker].pieces}</td>

                <td className="p-3 border">
                  ₹ {workerTotals[worker].workAmount}
                </td>

                <td className="p-3 border">
                  ₹ {workerTotals[worker].advanceAmount}
                </td>

                <td className="p-3 border font-bold">
                  ₹ {workerTotals[worker].finalBalance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Summary;
