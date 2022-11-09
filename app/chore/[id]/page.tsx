"use client";

import NProgress from "nprogress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Chore {
  name: string;
  day: string;
  id: string;
  userId: string;
}

export default function Chore({ params }: any) {
  NProgress.done(false);
  const router = useRouter();

  const [chore, setChore] = useState<Chore>();
  const [editedChore, setEditedChore] = useState<Chore>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  async function getChoreInfo(choreId: string) {
    NProgress.start();
    if (!localStorage.getItem("token")) router.push("/");
    const res = await fetch(`/api/chore/${choreId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      setChore(data);
      setEditedChore(data);
      return data;
    } else if (data.error) {
      alert(data.error);
    }
    NProgress.done(false);
  }

  async function saveChore(choreId: string) {
    NProgress.start();
    const res = await fetch(`/api/chore/${choreId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chore: editedChore,
        token: localStorage.getItem("token"),
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      setChore(data);
      setEditedChore(data);
      setIsEditing(false);
      return data;
    } else if (data.error) {
      alert(data.error);
    }
    NProgress.done(false);
  }

  async function removeChore(choreId: string) {
    NProgress.start();
    const res = await fetch(`/api/chore/${choreId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      router.push("/");
    } else if (data.error) {
      alert(data.error);
    }
  }

  useEffect(() => {
    getChoreInfo(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
      {chore && editedChore ? (
        <div key={chore.id}>
          {chore.name ? (
            <div>
              {!isEditing ? (
                <>
                  <h1>{chore.name}</h1>
                  <p>{chore.day}</p>
                </>
              ) : (
                <div>
                  <input
                    type="text"
                    value={editedChore.name}
                    onChange={(e) => {
                      setEditedChore({ ...editedChore, name: e.target.value });
                    }}
                  />
                  <select
                    value={editedChore.day}
                    onChange={(e) => {
                      setEditedChore({ ...editedChore, day: e.target.value });
                    }}
                  >
                    <option value="Monday">{"Monday"}</option>
                    <option value="Tuesday">{"Tuesday"}</option>
                    <option value="Wednesday">{"Wednesday"}</option>
                    <option value="Thursday">{"Thursday"}</option>
                    <option value="Friday">{"Friday"}</option>
                    <option value="Saturday">{"Saturday"}</option>
                    <option value="Sunday">{"Sunday"}</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            <p>{"Loading..."}</p>
          )}
          <div style={{ marginBottom: 16 }} />
          <button onClick={() => removeChore(params.id)}>
            {"DELETE CHORE"}
          </button>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>{"EDIT CHORE"}</button>
          ) : (
            <button onClick={() => saveChore(params.id)}>{"SAVE CHORE"}</button>
          )}
        </div>
      ) : (
        <>{"Loading..."}</>
      )}
    </>
  );
}
