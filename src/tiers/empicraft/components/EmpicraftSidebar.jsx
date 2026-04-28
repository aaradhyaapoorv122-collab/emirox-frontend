import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Home } from "lucide-react";

const features = [
  { label: "Smart Chat", icon: "🧠", route: "/empicraft/smart-chat" },
  { label: "Study Planner", icon: "🗓️", route: "/empicraft/study-planner" },
  { label: "Quiz Arena", icon: "🧩", route: "/empicraft/quiz-arena" },
  { label: "Test Review", icon: "📊", route: "/empicraft/test-review" },
  { label: "Concept Blocks", icon: "🧱", route: "/empicraft/concept-block-builder" },
  { label: "AI Summary", icon: "🧠📄", route: "/empicraft/AI-Summary-Mode" },
  { label: "Doubt Solver", icon: "❓", route: "/empicraft/doubt-solver" },
  { label: "Study Companion", icon: "🤖", route: "/empicraft/study-companion" },
  { label: "Skill Hub", icon: "🧪", route: "/empicraft/Skill-Hub" },
  { label: "Project Maker", icon: "📚", route: "/empicraft/project-maker" },
  { label: "Career Detector", icon: "📈", route: "/empicraft/career-detector" },
];

const mockChats = [];

export default function EmpiCraftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(280);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sidebarRef.current) return;
      if (window.__draggingSidebar) {
        const newWidth = Math.min(Math.max(e.clientX, 220), 420);
        setWidth(newWidth);
      }
    };

    const stopDrag = () => {
      window.__draggingSidebar = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  const filtered = useMemo(() => {
    return features.filter((f) =>
      f.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleNavigate = (route) => {
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
        {!isMobile && (
          <div
            className="resizeHandle"
            onMouseDown={() => (window.__draggingSidebar = true)}
          />
        )}

        {/* Dashboard */}
        <div className="item" onClick={() => handleNavigate("/Empicraft/Dashboard")}>
          <Home size={18} style={{ marginRight: 10 }} />
          Back to Dashboard
        </div>

        {/* Search */}
        <div className="searchBox">
          <Search size={16} color="#ff7a18" />
          <input
            className="searchInput"
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Features */}
        <div className="list">
          {filtered.map((item) => {
            const isActive = location.pathname === item.route;
            return (
              <div
                key={item.route}
                className={`item ${isActive ? "active" : ""}`}
                onClick={() => handleNavigate(item.route)}
              >
                <span style={{ marginRight: 10 }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .sidebar {
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: #0a0a0a;
          border-right: 1px solid #ff7a18;
          padding: 14px;
          display: flex;
          flex-direction: column;
          transition: 0.3s ease;
          z-index: 1000;
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
          background: #111;
          padding: 10px 12px;
          border-radius: 12px;
          margin-bottom: 14px;
          border: 1px solid #222;
        }

        .searchInput {
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          margin-left: 8px;
          width: 100%;
        }

        .item {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          margin-bottom: 6px;
        }

        .item:hover {
          background: #1a1a1a;
        }

        .active {
          background: rgba(255,122,24,0.15);
          box-shadow: inset 3px 0 #ff7a18;
        }

        .mobileBtn {
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1100;
          padding: 10px;
          border-radius: 10px;
          background: #0a0a0a;
          color: #ff7a18;
          border: 1px solid #ff7a18;
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
