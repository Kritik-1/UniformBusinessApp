import { useState, useEffect } from "react"

import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore"

import { db } from "../firebase/firebase"

function Workers() {

  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")

  const [workers, setWorkers] = useState([])

  const saveWorker = async () => {

    if (!name || !department) {
      alert("Fill all fields")
      return
    }

    await addDoc(collection(db, "workers"), {
      name,
      department
    })

    alert("Worker Added")

    setName("")
    setDepartment("")

    getWorkers()

  }

  const getWorkers = async () => {

    const querySnapshot = await getDocs(
      collection(db, "workers")
    )

    const arr = []

    querySnapshot.forEach((doc) => {

      arr.push({
        id: doc.id,
        ...doc.data()
      })

    })

    setWorkers(arr)

  }

  useEffect(() => {
    getWorkers()
  }, [])

  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <h1 className="text-3xl font-bold mb-8">
        Workers Management
      </h1>

      <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col gap-5">

        <input
          type="text"
          placeholder="Worker Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-4 rounded-xl border"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-4 rounded-xl border"
        >

          <option value="">
            Select Department
          </option>

          <option value="Stitching">
            Stitching
          </option>

          <option value="Turpai">
            Turpai
          </option>

          <option value="Ironing">
            Ironing
          </option>

        </select>

        <button
          onClick={saveWorker}
          className="bg-black text-white p-4 rounded-xl text-xl"
        >
          Add Worker
        </button>

      </div>

      <div className="mt-10 bg-white p-5 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold mb-5">
          Saved Workers
        </h2>

        <table className="w-full border">

          <thead>

            <tr className="bg-gray-200">

              <th className="p-3 border">
                Name
              </th>

              <th className="p-3 border">
                Department
              </th>

            </tr>

          </thead>

          <tbody>

            {
              workers.map((item) => (

                <tr key={item.id}>

                  <td className="p-3 border">
                    {item.name}
                  </td>

                  <td className="p-3 border">
                    {item.department}
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

export default Workers