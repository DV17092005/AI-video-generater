function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-mark">AI</span>
        <div>
          <h2>Video Studio</h2>
          <p>Automate short-form video creation.</p>
        </div>
      </div>

      <nav>
        <ul className="sidebar-nav">
          <li>Dashboard</li>
          <li>Create Video</li>
          <li>Analytics</li>
          <li>Integrations</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;