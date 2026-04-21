import React, { useState, useEffect, useRef } from "react";

/* ================= COLOR SCHEME ================= */
const colors = {
  school: "#4f79ff",
  tuition: "#ff9f43",
  study: "#2ed573",
  workout: "#ff6b81",
  freeTime: "#ffa502",
  sleep: "#57606f",
  restDay: "#70a1ff",
  textLight: "#f1f2f6",
  cardBg: "#1e272e",
  header: "#3742fa",
};

/* ================= PHYSIQUE OPTIONS ================= */
const physiqueOptions = ["Lean", "Muscular", "Average", "Bulky", "Slim"];

/* ================= HELPER FUNCTIONS ================= */
const getWeekDays = () => ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const hoursArray = () => Array.from({length:24},(_,i)=>i);

/* ================= AI PLANNER GENERATOR ================= */
const generatePlanner = (form) => {
  const weekDays = getWeekDays();
  const fullPlanner = {};
  weekDays.forEach(day => {
    fullPlanner[day] = [];
    for(let h=0; h<24; h++){
      let task="";
      if(h < form.wakeHour || h >= form.sleepHour) task="Sleep";
      else if(form.restDays.includes(day)) task="Rest Day";
      else if(h >= form.schoolStart && h < form.schoolEnd) task="School";
      else if(h >= form.tuitionStart && h < form.tuitionEnd) task="Tuition";
      else if(form.workoutDays > 0 && (h - form.wakeHour) % Math.floor((form.sleepHour - form.wakeHour)/form.workoutDays) === 0) task="Workout";
      else if(fullPlanner[day].filter(s=>s.task==="Study").length<form.studyHours) task="Study";
      else task="Free Time";
      fullPlanner[day].push({ hour:h, task });
    }
  });
  return fullPlanner;
};

/* ================= MAIN COMPONENT ================= */
export default function UltimateAIPlanner() {
  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    weight: 60,
    height: 170,
    wakeHour: 6,
    sleepHour: 22,
    physique: "Average",
    goalMonths: 3,
    restDays: ["Sunday"],
    schoolStart: 12,
    schoolEnd: 18,
    tuitionStart: 18,
    tuitionEnd: 20,
    studyHours: 3,
    workoutDays: 4,
    dietPreference: "Balanced",
  });

  /* ---------------- CHAT STATE ---------------- */
  const [messages, setMessages] = useState([{ from: "bot", text: "🚀 Welcome! Type 'generate plan' to create your full AI timetable." }]);
  const [inputText, setInputText] = useState("");
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);
  const chatEndRef = useRef(null);

  /* ---------------- SCROLL CHAT ---------------- */
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); },[messages]);

  /* ---------------- VOICE INPUT ---------------- */
  useEffect(()=>{
    if("webkitSpeechRecognition" in window){
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";
      recognition.current.onresult = (e)=>{ setInputText(e.results[0][0].transcript); setListening(false); };
      recognition.current.onerror = ()=>setListening(false);
      recognition.current.onend = ()=>setListening(false);
    }
  },[]);

  const startListening = ()=>{ recognition.current && (setListening(true), recognition.current.start()); };
  const stopListening = ()=>{ recognition.current?.stop(); setListening(false); };

  /* ---------------- FORM HANDLER ---------------- */
  const handleFormChange = (e)=>{
    const {name,value,type} = e.target;
    setForm(f => ({ ...f, [name]: type==="number"?Number(value):value }));
  };

  /* ---------------- CHAT COMMAND ---------------- */
  const parseChatCommand = (text)=>{
    const lower = text.toLowerCase();
    if(lower==="generate plan") return generatePlanner(form);
    if(lower.includes("diet")) return `🥗 Diet Plan: ${form.dietPreference} for physique "${form.physique}".`;
    if(lower.includes("workout")) return `🏋️ Workout: ${form.workoutDays} days/week for "${form.physique}".`;
    if(lower.includes("profile") || lower.includes("info")) return JSON.stringify(form,null,2);
    return "🤖 Command not recognized. Try 'generate plan', 'diet', 'workout', or 'show profile'.";
  };

  const handleSend = ()=>{
    if(!inputText.trim()) return;
    const userMsg = { from:"user", text:inputText.trim() };
    setMessages(msgs=>[...msgs,userMsg]);
    setInputText("");
    setTimeout(()=>{
      const reply = parseChatCommand(userMsg.text);
      if(typeof reply==="object"){
        setPlanner(reply); // update plannerData
        setMessages(msgs=>[...msgs,{from:"bot", text:"📊 Full AI Planner generated! Scroll below to view."}]);
      }else{
        setMessages(msgs=>[...msgs,{from:"bot", text:reply}]);
      }
    },500);
  };

  const onKeyDown = (e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); handleSend(); } };

  /* ---------------- PLANNER STATE ---------------- */
  const [plannerData, setPlanner] = useState(generatePlanner(form));

  const getTaskColor = (task)=>{
    switch(task){
      case "School": return colors.school;
      case "Tuition": return colors.tuition;
      case "Study": return colors.study;
      case "Workout": return colors.workout;
      case "Free Time": return colors.freeTime;
      case "Sleep": return colors.sleep;
      case "Rest Day": return colors.restDay;
      default: return "#999";
    }
  };

  const week = getWeekDays();

  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:20, fontFamily:"'Segoe UI', sans-serif", padding:20, maxWidth:1400, margin:"0 auto" }}>
      
      {/* ---------------- FORM PANEL ---------------- */}
      <div style={{ flex:1, minWidth:360, backgroundColor:colors.cardBg, padding:25, borderRadius:20, boxShadow:"0 6px 20px rgba(0,0,0,0.5)" }}>
        <h2 style={{ textAlign:"center", marginBottom:20, color:colors.textLight }}>📝 Profile & Preferences</h2>
        {Object.entries(form).map(([key,val])=>{
          if(typeof val==="number") return (
            <label key={key} style={{ display:"block", marginBottom:12, color:colors.textLight }}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, s=>s.toUpperCase())}:
              <input type="number" name={key} value={val} onChange={handleFormChange} style={inputStyle} />
            </label>
          );
          if(key==="physique") return (
            <label key={key} style={{ display:"block", marginBottom:12, color:colors.textLight }}>
              Physique:
              <select name={key} value={val} onChange={handleFormChange} style={inputStyle}>
                {physiqueOptions.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          );
          return null;
        })}
      </div>

      {/* ---------------- CHAT PANEL ---------------- */}
      <div style={{ flex:1, minWidth:360, backgroundColor:colors.cardBg, borderRadius:20, display:"flex", flexDirection:"column", maxHeight:"85vh", boxShadow:"0 6px 20px rgba(0,0,0,0.5)" }}>
        <header style={{ padding:15, textAlign:"center", fontWeight:"bold", color:colors.header, fontSize:"1.3em", borderBottom:`2px solid ${colors.freeTime}` }}>
          🤖 EmpiPlanner Chat
        </header>

        <div style={{ flexGrow:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:12 }}>
          {messages.map((msg,i)=>(
            <div key={i} style={{
              alignSelf: msg.from==="user"?"flex-end":"flex-start",
              backgroundColor: msg.from==="user"?colors.workout:colors.school,
              color:colors.textLight,
              padding:"10px 15px",
              borderRadius:15,
              maxWidth:"75%",
              whiteSpace:"pre-wrap",
              boxShadow:"0 3px 10px rgba(0,0,0,0.3)"
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef}/>
        </div>

        <footer style={{ padding:12, display:"flex", gap:8, borderTop:`2px solid ${colors.freeTime}` }}>
          <textarea rows={1} placeholder="Type message..." value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={onKeyDown} style={chatInputStyle} />
          {listening ?
            <button onClick={stopListening} style={voiceButtonStyle(colors.workout, "#ff4757")}>⏹️</button> :
            <button onClick={startListening} style={voiceButtonStyle(colors.freeTime, colors.study)}>🎤</button>
          }
          <button onClick={handleSend} style={voiceButtonStyle(colors.study, colors.workout)}>➤</button>
        </footer>
      </div>

      {/* ---------------- CALENDAR PANEL ---------------- */}
      <div style={{ flex:"1 1 100%", backgroundColor:colors.cardBg, borderRadius:20, padding:20, boxShadow:"0 6px 20px rgba(0,0,0,0.5)" }}>
        <h2 style={{ textAlign:"center", color:colors.textLight, marginBottom:20 }}>📅 AI Timetable</h2>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${week.length}, 1fr)`, gap:6 }}>
          {week.map(day=>{
            const dayTasks = plannerData[day] || Array(24).fill({task:"Free Time"});
            return (
              <div key={day} style={{ display:"flex", flexDirection:"column", backgroundColor:colors.cardBg, borderRadius:12, padding:6 }}>
                <div style={{ textAlign:"center", fontWeight:"bold", color:colors.textLight, marginBottom:4 }}>{day}</div>
                {hoursArray().map(hour=>{
                  const taskObj = dayTasks[hour];
                  const color = getTaskColor(taskObj?.task);
                  return (
                    <div key={hour} style={{
                      height:28,
                      marginBottom:2,
                      backgroundColor:color,
                      borderRadius:6,
                      color:colors.textLight,
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      fontSize:11,
                      cursor:"pointer"
                    }} title={`${hour}:00 - ${taskObj?.task}`}>
                      {hour}h
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* ================= STYLES ================= */
const inputStyle = { width:"100%", padding:"10px 12px", margin:"6px 0 12px", borderRadius:12, border:"none", fontSize:"1em", fontFamily:"'Segoe UI', sans-serif" };
const chatInputStyle = { flexGrow:1, borderRadius:20, border:"none", padding:"10px 15px", fontSize:"1em", resize:"none", fontFamily:"'Segoe UI', sans-serif" };
const voiceButtonStyle = (bg,shadow) => ({ backgroundColor:bg, border:"none", borderRadius:15, padding:"0 15px", cursor:"pointer", color:"#fff", fontSize:"1.2em", boxShadow:`0 4px 12px ${shadow}` });