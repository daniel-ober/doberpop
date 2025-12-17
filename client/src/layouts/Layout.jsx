import TopNav from "../components/TopNav";

export default function Layout({ children }) {
  return (
    <div className="app-root">
      <TopNav />
      <main className="app-content">{children}</main>
    </div>
  );
}