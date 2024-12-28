import localFont from "next/font/local";
import "./globals.css";
import ProviderApollo from "./components/apolloProvider/ProviderApollo"
import ToastMessage from "./config/ToastMessage";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PMS",
  description: "Project Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ProviderApollo>
          <div>
            {children}
            <ToastMessage/>
          </div>
        </ProviderApollo>
      </body>
    </html>
  );
}
