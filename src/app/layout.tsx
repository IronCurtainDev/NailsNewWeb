import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auréva Nails by Che | Bespoke Gel Nails & Nail Art Studio",
  description:
    "Luxury bespoke gel manicures, nail extensions, and hand-painted nail art by Che. Private studio appointments. Custom designs tailored to you.",
  keywords:
    "Auréva Nails, nails by Che, gel manicure, nail extensions, nail art, bespoke nails, bridal nails, custom nail design, private nail studio",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Auréva Nails by Che | Bespoke Gel Nails & Nail Art Studio",
    description:
      "Luxury bespoke gel manicures, nail extensions, and hand-painted nail art by Che. Private studio appointments. Custom designs tailored to you.",
    images: ["/nails.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
