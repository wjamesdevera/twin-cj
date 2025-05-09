import type { Metadata } from "next";
import "./globals.scss";
import {
  Abril_Fatface,
  Poltawski_Nowy,
  Open_Sans,
  Poppins,
} from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const abrilFatface = Abril_Fatface({
  variable: "--font-abril-fatface",
  weight: "400",
  subsets: ["latin"],
});

const poltawskiNowy = Poltawski_Nowy({
  variable: "--font-poltawski-nowy",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twin CJ Riverside Glamping Resort",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${openSans.variable} ${abrilFatface.variable} ${poltawskiNowy.variable} ${openSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
