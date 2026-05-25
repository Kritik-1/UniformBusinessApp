function StitchingForm({
  worker,
  setWorker,
  product,
  setProduct,
  color,
  setColor,
  sizes,
  setSizes,
  pieces,
  setPieces,
  rate,
  setRate,
  date,
  setDate,
  saveData,
  workers,
  editId
}) {

  return (

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
        placeholder="Product Type"
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
        type="text"
        placeholder="Sizes"
        value={sizes}
        onChange={(e) => setSizes(e.target.value)}
        className="p-4 rounded-xl border"
      />

      <input
        type="number"
        placeholder="No. of Pieces"
        value={pieces}
        onChange={(e) => setPieces(e.target.value)}
        className="p-4 rounded-xl border"
      />

      <input
        type="number"
        placeholder="Rate Per Piece"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
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

  )
}

export default StitchingForm