import "./globals.css";

export const metadata = {
  title: "Biology AI Grader",
  description: "Teacher-controlled AI grading for Biology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
