"use client";

import { useRouter } from "next/navigation";
import NProgress from "nprogress";

import { useState } from "react";

export default function Create() {
  const [chore, setChore] = useState("");
  const [day, setDay] = useState("Monday");
  const router = useRouter();

  NProgress.done(false);

  async function createChore() {
    if (localStorage.getItem("token")) {
      const res = await fetch("/api/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: chore,
          day,
          token: localStorage.getItem("token"),
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        NProgress.start();
        router.push("/");
      } else if (data.error) {
        alert(data.error);
      }
      NProgress.done(false);
    }
    router.push("/");
  }

  return (
    <div>
      <button
        style={{
          position: "fixed",
          top: 16,
          right: 16,
        }}
        onClick={() => {
          NProgress.start();
          router.push("/");
        }}
      >
        {"Back"}
      </button>
      <h1>{"Create a Chore"}</h1>
      <div style={{ marginBottom: "16" }} />
      <input
        type="text"
        placeholder="Chore"
        value={chore}
        onChange={(e) => setChore(e.target.value)}
      />
      <select value={day} onChange={(e) => setDay(e.target.value)}>
        <option value="Monday">{"Monday"}</option>
        <option value="Tuesday">{"Tuesday"}</option>
        <option value="Wednesday">{"Wednesday"}</option>
        <option value="Thursday">{"Thursday"}</option>
        <option value="Friday">{"Friday"}</option>
        <option value="Saturday">{"Saturday"}</option>
        <option value="Sunday">{"Sunday"}</option>
      </select>
      <button onClick={createChore} className="light-blue-button">
        <h1>+ CREATE</h1>
      </button>
    </div>
  );
}
