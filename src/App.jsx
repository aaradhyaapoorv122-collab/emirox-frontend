import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ================= SCREENS ================= */
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import TierSelector from "./components/TierSelector";

/* ================= CONTEXT ================= */
import { AuthContext } from "./context/AuthContext";


/* ================= EMPICRAFT ================= */
import EmpiCraftDashboard from "./tiers/empicraft/EmpiCraftDashboard";
import EmpiCraftFeatureLayout from "./tiers/empicraft/layouts/EmpiCraftFeatureLayout";


import SmartChat from "./tiers/empicraft/features/SmartChat";
import StudyPlanner from "./tiers/empicraft/features/StudyPlanner";
import QuizArena from "./tiers/empicraft/features/QuizArenaSystem/QuizArena";
import ConceptBlocks from "./tiers/empicraft/features/ConceptBlocks";
import TestReview from "./tiers/empicraft/features/TestReview";
import SummaryMode from "./tiers/empicraft/features/SummaryMode";
import DoubtSolver from "./tiers/empicraft/features/DoubtSolver";
import StudyCompanion from "./tiers/empicraft/features/StudyCompanion";

/* ================= EMPILAB ================= */
import EmpiLabFeatureLayout from "./tiers/empilab/layouts/EmpiLabFeatureLayout";
import EmpilabDashboard from "./tiers/empilab/EmpilabDashboard";
import SmartMentor from "./tiers/empilab/features/SmartMentor";
import SkillHub from "./tiers/empilab/features/SkillHub";
import TestArena from "./tiers/empilab/features/TestArena";
import PracticeLabs from "./tiers/empilab/features/PracticeLabs";
import NotesHub from "./tiers/empilab/features/NotesHub";
import CareerDetector from "./tiers/empilab/features/CareerDetector";
import ProjectMaker from "./tiers/empilab/features/ProjectMaker";
import PerformanceCoach from "./tiers/empilab/features/PerformanceCoach"
import Challenger from "./tiers/empilab/features/Challenger"

/* ================= REMINDER ENGINE ================= */
import EmpiReminderEngine from "./tiers/empilab/features/AIReminder";

export default function App() {
  const { user, loadingUser } = useContext(AuthContext);

  /* ========== EMPI REMINDER ENGINE ========== */
  useEffect(() => {
    if (!user?.id) return;

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const engine = new EmpiReminderEngine(user.id);
    engine.startEngine();

    console.log("✅ EmpiReminderEngine started:", user.id);
  }, [user]);

  if (loadingUser) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Checking user session...
      </div>
    );
  }

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      {!user && (
        <>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {/* ================= PROTECTED ================= */}
      {user && (
        <>
          {/* Tier Selector */}
          <Route path="/tier-selector" element={<TierSelector />} />

          {/* ===== EMPICRAFT DASHBOARD (NO SIDEBAR) ===== */}
          <Route
            path="/empicraft/dashboard"
            element={
                <EmpiCraftDashboard />
              
            }
          />

          {/* ===== EMPICRAFT FEATURES (WITH SIDEBAR) ===== */}
          <Route
            path="/empicraft"
            element={
             
                <EmpiCraftFeatureLayout />
              
            }
          >
            <Route path="smart-chat" element={<SmartChat />} />
            <Route path="study-planner" element={<StudyPlanner />} />
            <Route path="quiz-arena" element={<QuizArena />} />
            <Route path="test-review" element={<TestReview />} />
            <Route path="concept-block-builder" element={<ConceptBlocks />} />
            <Route path="AI-Summary-Mode" element={<SummaryMode />} />
            <Route path="/empicraft/doubt-solver" element={<DoubtSolver />} />
            <Route path="/empicraft/study-companion" element={<StudyCompanion />} />
          </Route>

          {/* ===== EMPILAB ===== */}
          <Route
            path="/empilab/dashboard"
            element={
              
                <EmpilabDashboard />
              
            }
          />
          {/* ===== EMPILAB FEATURES (WITH SIDEBAR) ===== */}
<Route
  path="/empilab"
  element={
    
      <EmpiLabFeatureLayout />
    
  }
>
  <Route path="smart-mentor" element={<SmartMentor />} />
  <Route path="Skill-Hub" element={<SkillHub />} />
  <Route path="test-arena" element={<TestArena />} />
  <Route path="practice-labs" element={<PracticeLabs />} />
  <Route path="notes-generator" element={<NotesHub />} />
  <Route path="project-maker" element={<ProjectMaker />} />
  <Route path="career-detector" element={<CareerDetector />} />
  <Route path="Challenge Generator" element={<Challenger />} />
  <Route path="Performance Coach" element={<PerformanceCoach />} />
</Route>

          {/* ===== DEFAULT ===== */}
          <Route path="/" element={<Navigate to="/tier-selector" replace />} />
          <Route path="*" element={<Navigate to="/tier-selector" replace />} />
        </>
      )}
    </Routes>
  );
}
