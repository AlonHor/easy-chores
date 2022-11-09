"use client";

import "../styles/globals.css";
import "../styles/nprogress.css";

import Router from "next/router";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  Router.events.on("routeChangeStart", () => {
    console.log("routeChangeStart");
  });

  Router.events.on("routeChangeComplete", () => {
    console.log("routeChangeComplete");
  });

  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="application-name" content="EasyChores" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EasyChores" />
        <meta name="description" content="Reminds you to do your chores!" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2F2F2F" />

        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/favicon-48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/favicon-256.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <title>EasyChores</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
