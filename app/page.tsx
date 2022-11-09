"use client";

import { useRouter } from "next/navigation";
import NProgress from "nprogress";

import { useEffect, useState } from "react";

interface Chore {
  name: string;
  day: string;
  id: string;
  userId: string;
}

interface User {
  email: string;
}

export default function Page(): JSX.Element {
  NProgress.done(false);
  const [chores, setChores] = useState<Chore[]>([]);
  const [user, setUser] = useState<User>();
  const [didLoad, setDidLoad] = useState<boolean>(false);

  const router = useRouter();

  function gotoChore(id: string) {
    NProgress.start();
    router.push(`/chore/${id}`);
  }

  async function logout(): Promise<void> {
    if (!localStorage.getItem("token")) router.push("/login");
    NProgress.start();
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
    localStorage.removeItem("token");
    router.push("/login");
  }

  async function fetchChores(): Promise<void> {
    const res = await fetch("/api/chores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
    const data: Chore[] = await res.json();
    const errorChecker: any = data;
    if (errorChecker.error)
      if (errorChecker.error === "User not found!")
        return router.push("/login");
    setDidLoad(true);
    NProgress.done(false);
    setChores(
      data.sort((a: Chore, b: Chore) => {
        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        return days.indexOf(a.day) - days.indexOf(b.day);
      })
    );
  }

  async function fetchUser(): Promise<void> {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
    const data: User = await res.json();
    setUser(data);
  }

  async function fetchData(): Promise<void> {
    NProgress.start();
    if (!localStorage.getItem("token")) return router.push("/login");
    const fetchChoresPromise = fetchChores();
    const fetchUserPromise = fetchUser();

    await Promise.all([fetchChoresPromise, fetchUserPromise]);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {chores ? (
        <>
          <h1>{"Today's Chores"}</h1>
          <div>
            {chores.filter((chore: Chore) => {
              const today = new Date().toLocaleString("en-US", {
                weekday: "long",
              });
              return chore.day === today;
            }).length > 0 ? (
              <>
                {chores.map((chore: Chore, index: number) => {
                  const today = new Date().toLocaleString("en-us", {
                    weekday: "long",
                  });
                  if (today === chore.day) {
                    return (
                      <div key={index}>
                        <button onClick={() => gotoChore(chore.id)}>
                          <h1>{`${chore.name} - ${chore.day}`}</h1>
                        </button>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </>
            ) : (
              <>
                {didLoad ? (
                  <div>{"No chores for today!"}</div>
                ) : (
                  <div>{"Loading..."}</div>
                )}
              </>
            )}
          </div>
          <div style={{ marginBottom: 48 }} />
          <h1 style={{ marginBottom: 16 }}>{"Chores"}</h1>
          <div>
            {chores.length > 0 ? (
              <>
                {chores.map((chore: Chore, index: number) => (
                  <div key={index}>
                    <button onClick={() => gotoChore(chore.id)}>
                      <div>{`${chore.name} - ${chore.day}`}</div>
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <>
                {didLoad ? (
                  <div>{"No chores!"}</div>
                ) : (
                  <div>{"Loading..."}</div>
                )}
              </>
            )}
            <button
              onClick={() => {
                NProgress.start();
                router.push("/create");
              }}
              className="light-blue-button"
            >
              <h1>{"+ Create Chore"}</h1>
            </button>
          </div>
        </>
      ) : (
        <div>{"Loading your chores..."}</div>
      )}
      {user ? (
        <>
          <div style={{ position: "fixed", top: 10, left: 10 }}>
            <button onClick={logout}>{"Log Out"}</button>
          </div>
        </>
      ) : null}
    </div>
  );
}
