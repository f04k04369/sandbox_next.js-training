import Header from "@/components/header";

export default function PrivatePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <>
  <Header />
  <main className="pt-16 max-w-screen-xl mx-auto px-10">{children}</main>
  </>
  );
}
