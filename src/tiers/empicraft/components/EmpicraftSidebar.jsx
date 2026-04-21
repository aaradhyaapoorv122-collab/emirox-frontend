import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MessageSquarePlus, Trash2, Settings, Home } from "lucide-react";

const features = [
  { label: "Smart Chat", icon: "🧠", route: "/empicraft/smart-chat" },
  { label: "Study Planner", icon: "🗓️", route: "/empicraft/study-planner" },
  { label: "Quiz Arena", icon: "🧩", route: "/empicraft/quiz-arena" },
  { label: "Test Review", icon: "📊", route: "/empicraft/test-review" },
  { label: "Concept Blocks", icon: "🧱", route: "/empicraft/concept-block-builder" },
  { label: "AI Summary", icon: "🧠📄", route: "/empicraft/AI-Summary-Mode" },
  { label: "Doubt Solver", icon: "❓", route: "/empicraft/doubt-solver" },
  { label: "Study Companion", icon: "🤖", route: "/empicraft/study-companion" },
];

const mockChats = [
  { id: 1, title: "Math Revision Plan" },
  { id: 2, title: "AI Summary Notes" },
  { id: 3, title: "Quiz Strategy" },
];

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

  // ===== DRAG RESIZE =====
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
      {/* Mobile Toggle */}
      {isMobile && (
        <button className="mobileBtn" onClick={() => setOpen(true)}>
          ☰
        </button>
      )}

      {/* Overlay */}
      {isMobile && open && (
        <div className="overlay" onClick={() => setOpen(false)} />
      )}

      <div
        ref={sidebarRef}
        className="sidebar"
        style={{
           width: isMobile ? 290 : width,
          position: isMobile ? "fixed" : "relative",
          transform: isMobile
       ? (open ? "translateX(0)" : "translateX(-100%)") : "none",
        }}
      >
        {/* Resize Handle */}
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
          <Search size={16} color="#8B7CF6" />
          <input
            className="searchInput"
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Chat History Panel */}
        <div className="chatPanel">
          <div className="panelTitle">💬 Chat History</div>
          {mockChats.map((chat) => (
            <div key={chat.id} className="chatItem">
              {chat.title}
            </div>
          ))}
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

        {/* Bottom */}
        <div className="bottom">
          <IconButton icon={<MessageSquarePlus size={18} />} label="New Chat" />
          <IconButton icon={<Trash2 size={18} />} label="Trash" />
          <IconButton icon={<Settings size={18} />} label="Settings" />
        </div>
      </div>

      <style>{`
        .sidebar {
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: #0f1420;
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
          background: transparent;
        }

        .chatPanel {
          margin: 10px 0;
          padding: 10px;
          background: #151a26;
          border-radius: 12px;
        }

        .panelTitle {
          font-size: 12px;
          color: #8b7cf6;
          margin-bottom: 8px;
        }

        .chatItem {
          padding: 6px;
          font-size: 13px;
          color: #e6e8f0;
          cursor: pointer;
          border-radius: 6px;
        }

        .chatItem:hover {
          background: #1a2233;
        }

        .searchBox {
          display: flex;
          align-items: center;
          background: #151a26;
          padding: 10px 12px;
          border-radius: 12px;
          margin-bottom: 14px;
        }

        .searchInput {
          background: transparent;
          border: none;
          outline: none;
          color: #e6e8f0;
          margin-left: 8px;
          width: 100%;
        }

        .item {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 12px;
          color: #e6e8f0;
          cursor: pointer;
          margin-bottom: 6px;
        }

        .active {
          background: rgba(139,124,246,0.15);
          box-shadow: inset 3px 0 #8b7cf6;
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #1f2433;
        }

        .iconBtn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #151a26;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b7cf6;
          cursor: pointer;
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

function IconButton({ icon, label }) {
  return (
    <div className="iconBtn" title={label}>
      {icon}
    </div>
  );
}
