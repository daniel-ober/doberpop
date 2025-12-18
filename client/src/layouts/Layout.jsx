// client/src/layouts/Layout.jsx
import TopNav from "../components/TopNav";

export default function Layout({ children, currentUser, handleLogout }) {
  return (
    <div className="app-root">
      <TopNav
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
      <main className="app-content">{children}</main>
    </div>
  );
}