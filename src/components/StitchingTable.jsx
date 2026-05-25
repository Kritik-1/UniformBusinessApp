function StitchingTable({ entries, updateStatus, editEntry, deleteEntry }) {
  return (
    <div className="mt-10 bg-white p-5 rounded-2xl shadow-lg overflow-auto">
      <h2 className="text-2xl font-bold mb-5">Saved Entries</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Worker</th>

            <th className="p-3 border">Product</th>

            <th className="p-3 border">Color</th>

            <th className="p-3 border">Sizes</th>

            <th className="p-3 border">Pieces</th>

            <th className="p-3 border">Rate</th>

            <th className="p-3 border">Date</th>

            <th className="p-3 border">Status</th>

            <th className="p-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((item) => (
            <tr key={item.id}>
              <td className="p-3 border">{item.worker}</td>

              <td className="p-3 border">{item.product}</td>

              <td className="p-3 border">{item.color}</td>

              <td className="p-3 border">{item.sizes}</td>

              <td className="p-3 border">{item.pieces}</td>

              <td className="p-3 border">₹ {item.rate}</td>

              <td className="p-3 border">
                {item.date?.toDate
                  ? item.date.toDate().toLocaleDateString("en-GB")
                  : ""}
              </td>

              <td className="p-3 border">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => updateStatus(item.id, "Given")}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Given
                  </button>

                  <button
                    onClick={() => updateStatus(item.id, "Returned")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Returned
                  </button>
                </div>

                <p className="mt-2 font-semibold">{item.status}</p>
              </td>

              <td className="p-3 border">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => editEntry(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEntry(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StitchingTable;
