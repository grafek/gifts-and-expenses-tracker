function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid min-h-[calc(100vh-218px)] place-items-center">
      {children}
    </section>
  );
}

export default Layout;
