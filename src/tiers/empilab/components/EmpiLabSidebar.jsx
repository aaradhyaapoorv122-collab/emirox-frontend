import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Settings, Home } from "lucide-react";

const features = [
  { label: "Smart Mentor", icon: "🎧🧠", route: "/empilab/smart-mentor" },
  { label: "Skill Hub", icon: "🧪", route: "/empilab/Skill-Hub" },
  { label: "Test Arena", icon: "🏟️", route: "/empilab/test-arena" },
  { label: "Practice Labs", icon: "🧱", route: "/empilab/practice-labs" },
  { label: "Notes Hub", icon: "🧾", route: "/empilab/notes-generator" },
  { label: "Project Maker", icon: "📚", route: "/empilab/project-maker" },
  { label: "Career Detector", icon: "📈", route: "/empilab/career-detector" },
  { label: "Performance Coach", icon: "📊", route: "/empilab/performance-coach" },
  { label: "Challenge Generator", icon: "⚡", route: "/empilab/challenge-generator" },
];

const mockChats = [
  { id: 1, title: "Skill Growth Plan" },
  { id: 2, title: "Test Strategy" },
  { id: 3, title: "Career Ideas" },
];

export default function EmpiLabSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(290);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // DRAG RESIZE
  useEffect(() => {
    const onMove = (e) => {
      if (window.__dragLabSidebar) {
        const newWidth = Math.min(Math.max(e.clientX, 220), 420);
        setWidth(newWidth);
      }
    };

    const stop = () => (window.__dragLabSidebar = false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stop);
    };
  }, []);

  const filtered = useMemo(() => {
    return features.filter((f) =>
      f.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const go = (route) => {
    navigate(route);
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {isMobile && (
        <button className="mobileBtn" onClick={() => setOpen(true)}>
          ☰
        </button>
      )}

      {isMobile && open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div
        ref={sidebarRef}
        className="sidebar"
        style={{
          width: isMobile ? 290 : width,
          position: isMobile ? "fixed" : "relative",
          transform: isMobile
            ? open
              ? "translateX(0)"
              : "translateX(-100%)"
            : "none",
        }}
      >
        {/* Resize only desktop */}
        {!isMobile && (
          <div
            className="resizeHandle"
            onMouseDown={() => (window.__dragLabSidebar = true)}
          />
        )}

        <div className="item" onClick={() => go("/EmpiLab/Dashboard")}>
          <Home size={18} style={{ marginRight: 10 }} />
          Back to Dashboard
        </div>

        <div className="searchBox">
          <Search size={16} color="#5EEAD4" />
          <input
            className="searchInput"
            placeholder="Search EmpiLab..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chatPanel">
          <div className="panelTitle">💬 Chat History</div>
          {mockChats.map((c) => (
            <div key={c.id} className="chatItem">
              {c.title}
            </div>
          ))}
        </div>

        <div className="list">
          {filtered.map((item) => {
            const active = location.pathname === item.route;
            return (
              <div
                key={item.route}
                className={`item ${active ? "active" : ""}`}
                onClick={() => go(item.route)}
              >
                <span style={{ marginRight: 10 }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </div>

        <div className="footer">
          <Settings size={18} />
        </div>
      </div>

      <style>{`
        .sidebar {
          height: 100vh;
          top: 0;
          left: 0;
          background: #07121F;
          padding: 14px;
          display: flex;
          flex-direction: column;
          transition: 0.3s ease;
          box-shadow: 2px 0 25px rgba(0,0,0,0.5);
        }

        .resizeHandle {
          position: absolute;
          right: 0;
          top: 0;
          width: 6px;
          height: 100%;
          cursor: ew-resize;
        }

        .searchBox {
          display: flex;
          align-items: center;
          background: #0C1C2D;
          padding: 10px 12px;
          border-radius: 12px;
          margin-bottom: 14px;
        }

        .searchInput {
          margin-left: 8px;
          background: transparent;
          border: none;
          outline: none;
          color: #E5E7EB;
          width: 100%;
        }

        .chatPanel {
          background: #0C1C2D;
          padding: 10px;
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .panelTitle {
          font-size: 12px;
          color: #5EEAD4;
          margin-bottom: 8px;
        }

        .chatItem {
          padding: 6px;
          color: #E5E7EB;
          font-size: 13px;
          cursor: pointer;
          border-radius: 6px;
        }

        .chatItem:hover {
          background: #10263a;
        }

        .item {
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
          color: #E5E7EB;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
        }

        .active {
          background: rgba(94,234,212,0.15);
          box-shadow: inset 3px 0 #5EEAD4;
        }

        .footer {
          border-top: 1px solid #123;
          padding-top: 12px;
          display: flex;
          justify-content: center;
          color: #5EEAD4;
        }

        .mobileBtn {
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1100;
          padding: 10px;
          border-radius: 10px;
          background: #111827;
          color: white;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          z-index: 999;
        }
      `}</style>
    </>
  );
}
