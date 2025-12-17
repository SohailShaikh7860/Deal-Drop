
import "./globals.css";


export const metadata = {
  title: "Deal Drop",
  description: "Discover the Best Deals and Discounts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
