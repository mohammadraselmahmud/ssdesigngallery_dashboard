import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "../lib/Providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Prime Pilates Admin Dashboard",
    template: "%s | Prime Pilates",
  },
  description:
    "Prime Pilates is a platform where you start learning to best online courses and level up your abilities and chart your career's course by immersing yourself in our distinctive learning experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${montserrat.className} ${montserrat.variable} box-border antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
