"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  NProgress.done(false);

  async function register() {
    NProgress.start();
    setEmail((email) => {
      return email.replaceAll(" ", "").replaceAll('"', "").replaceAll("'", "");
    });
    setPassword((password) => {
      return password
        .replaceAll(" ", "")
        .replaceAll('"', "")
        .replaceAll("'", "");
    });

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      localStorage.setItem("token", data.token);
      NProgress.start();
      router.push("/");
    } else if (data.error) {
      alert(data.error);
    }
    NProgress.done(false);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>{"Register"}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") register();
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") register();
        }}
      />
      <button onClick={register} className="light-blue-button">
        <h1>{"REGISTER"}</h1>
      </button>
      <p>
        {"Already have an account?"}
        <Link href="/login" style={{ color: "lightblue" }}>
          {"Login"}
        </Link>
      </p>
    </div>
  );
}
