import { Michroma, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./cart";
import Header from "./Header";
import Footer from "./Footer";
import BackLink from "./BackLink";
const wide = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-wide" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
export const metadata = { title: "NAQSH | Eastern wear for men and women", description: "Kurtas, shalwar kameez and more from Pakistan's best loved brands." };
export default function Root({ children }) {
  return (
    <html lang="en" className={`${wide.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <BackLink />
          <div>{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
