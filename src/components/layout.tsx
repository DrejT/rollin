type childrenProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: childrenProps) {
  return (
    <>
      <div className="container">{children}</div>
    </>
  );
}
