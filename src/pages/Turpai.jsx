import { useState, useEffect } from "react"

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore"

import { db } from "../firebase/firebase"

function Turpai() {

  const [worker, setWorker] = useState("")
  const [product, setProduct] = useState("")
  const [color, setColor] = useState("")

  const [sentPieces, setSentPieces] = useState("")
  const [returnedPieces, setReturnedPieces] = useState("")

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [entries, setEntries] = useState([])

  const [workers, setWorkers] = useState([])

  const [editId, setEditId] = useState(null)

  const [search, setSearch] = useState("")

  const getWorkers = async () => {

    const q = query(
      collection(db, "workers"),
      where("department", "==", "Turpai")
    )

    const querySnapshot = await getDocs(q)

    const arr = []

    querySnapshot.forEach((doc) => {

      arr.push({
        id: doc.id,
        ...doc.data()
      })

    })

    setWorkers(arr)

  }

  const getData = async () => {

    const querySnapshot = await getDocs(
      collection(db, "turpai")
    )

    const arr = []

    querySnapshot.forEach((doc) => {

      arr.push({
        id: doc.id,
        ...doc.data()
      })

    })

    setEntries(arr)

  }

  const saveData = async () => {

    try {

      if (editId) {

        const ref = doc(db, "turpai", editId)

        await updateDoc(ref, {

          worker,
          product,
          color,
          sentPieces,
          returnedPieces,
          pendingPieces:
            Number(sentPieces) -
            Number(returnedPieces),

          date: new Date(date)

        })

        alert("Entry Updated")

        setEditId(null)

      } else {

        await addDoc(collection(db, "turpai"), {

          worker,
          product,
          color,
          sentPieces,
          returnedPieces,

          pendingPieces:
            Number(sentPieces) -
            Number(returnedPieces),

          date: new Date(date)

        })

        alert("Entry Saved")

      }

      setWorker("")
      setProduct("")
      setColor("")
      setSentPieces("")
      setReturnedPieces("")

      getData()

    } catch (error) {

      console.log(error)

      alert("Error")

    }

  }

  const editEntry = (item) => {

    setEditId(item.id)

    setWorker(item.worker)
    setProduct(item.product)
    setColor(item.color)

    setSentPieces(item.sentPieces)
    setReturnedPieces(item.returnedPieces)

    setDate(
      item.date?.toDate
        ? item.date
            .toDate()
            .toISOString()
            .split("T")[0]
        : ""
    )

  }

  const deleteEntry = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this entry?"
    )

    if (!confirmDelete) {
      return
    }

    await deleteDoc(
      doc(db, "turpai", id)
    )

    alert("Deleted")

    getData()

  }

  useEffect(() => {

    getWorkers()

    getData()

  }, [])

  const filteredEntries = entries.filter((item) => {

    return (

      item.worker
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      item.product
        ?.toLowerCase()
        .includes(search.toLowerCase())

    )

  })

  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <h1 className="text-3xl font-bold mb-8">
        Turpai Entry
      </h1>

      <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col gap-5">

        <select
          value={worker}
          onChange={(e) => setWorker(e.target.value)}
          className="p-4 rounded-xl border"
        >

          <option value="">
            Select Worker
          </option>

          {
            workers.map((item) => (

              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>

            ))
          }

        </select>

        <input
          type="text"
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="p-4 rounded-xl border"
        />

        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="p-4 rounded-xl border"
        />

        <input
          type="number"
          placeholder="Sent Pieces"
          value={sentPieces}
          onChange={(e) =>
            setSentPieces(e.target.value)
          }
          className="p-4 rounded-xl border"
        />

        <input
          type="number"
          placeholder="Returned Pieces"
          value={returnedPieces}
          onChange={(e) =>
            setReturnedPieces(e.target.value)
          }
          className="p-4 rounded-xl border"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-4 rounded-xl border"
        />

        <button
          onClick={saveData}
          className="bg-black text-white p-4 rounded-xl text-xl"
        >
          {
            editId
              ? "Update Entry"
              : "Save Entry"
          }
        </button>

      </div>

      <input
        type="text"
        placeholder="Search Worker or Product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 rounded-2xl border my-5"
      />

      <div className="bg-white p-5 rounded-2xl shadow-lg overflow-auto">

        <table className="w-full border">

          <thead>

            <tr className="bg-gray-200">

              <th className="p-3 border">
                Worker
              </th>

              <th className="p-3 border">
                Product
              </th>

              <th className="p-3 border">
                Color
              </th>

              <th className="p-3 border">
                Sent
              </th>

              <th className="p-3 border">
                Returned
              </th>

              <th className="p-3 border">
                Pending
              </th>

              <th className="p-3 border">
                Date
              </th>

              <th className="p-3 border">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {
              filteredEntries.map((item) => (

                <tr key={item.id}>

                  <td className="p-3 border">
                    {item.worker}
                  </td>

                  <td className="p-3 border">
                    {item.product}
                  </td>

                  <td className="p-3 border">
                    {item.color}
                  </td>

                  <td className="p-3 border">
                    {item.sentPieces}
                  </td>

                  <td className="p-3 border">
                    {item.returnedPieces}
                  </td>

                  <td className="p-3 border font-bold">
                    {item.pendingPieces}
                  </td>

                  <td className="p-3 border">

                    {
                      item.date?.toDate
                        ? item.date
                            .toDate()
                            .toLocaleDateString("en-GB")
                        : ""
                    }

                  </td>

                  <td className="p-3 border">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          editEntry(item)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteEntry(item.id)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </div>

  )
}

export default Turpai