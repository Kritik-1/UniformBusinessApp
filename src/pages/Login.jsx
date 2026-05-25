import { useState } from "react"

import {
  signInWithEmailAndPassword
} from "firebase/auth"

import { auth } from "../firebase/firebase"

function Login() {

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const login = async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      alert("Login Successful")

    } catch (error) {

      console.log(error)

      alert("Invalid Credentials")

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px] flex flex-col gap-5">

        <h1 className="text-3xl font-bold text-center">
          Uniform Business Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="p-4 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="p-4 border rounded-xl"
        />

        <button
          onClick={login}
          className="bg-black text-white p-4 rounded-xl text-lg"
        >
          Login
        </button>

      </div>

    </div>

  )

}

export default Login