import React, { createContext, useContext, useState, useEffect } from "react";

const themes = {
  emerald: {
    name: "emerald",
    primary: "#18e09b",
    secondary: "#0ee2a1",
    background: "linear-gradient(180deg, #0d261b 0%, #1e5130 100%)",
    text: "#fff",
    card: "rgba(255,255,255,0.05)",
  },
  neonblue: {
    name: "neonblue",
    primary: "#00ffc3",
    secondary: "#00e5b8",
    background: "linear-gradient(180deg, #001a19 0%, #004d45 100%)",
    text: "#0ff",
    card: "rgba(0,255,255,0.1)",
  },
  aurora: {
    name: "aurora",
    primary: "#f43b86",
    secondary: "#f54f9d",
    background: "linear-gradient(180deg, #33001a 0%, #660033 100%)",
    text: "#ffccee",
    card: "rgba(255,0,102,0.1)",
  },
};

const ThemeContext = createContext({
  theme: themes.emerald,
  changeTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem("app-theme") || "emerald";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", themeName);
  }, [themeName]);

  const changeTheme = (name) => {
    if (themes[name]) setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
