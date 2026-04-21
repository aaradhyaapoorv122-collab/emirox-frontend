import React, { createContext, useState, useEffect } from "react";


export const ThemeContext = createContext();


const themeStyles = {
neon: {
background: "linear-gradient(135deg, #8a2be2, #ff00ff)",
accent: "#ff00ff",
},
blue: {
background: "linear-gradient(135deg, #001f3f, #0077ff)",
accent: "#0077ff",
},
gold: {
background: "linear-gradient(135deg, #ffb300, #ffd700)",
accent: "#ffdd55",
},
green: {
background: "linear-gradient(135deg, #004d40, #00ff9f)",
accent: "#00ff9f",
},
};


export function ThemeProvider({ children }) {
const [theme, setTheme] = useState(themeStyles.neon);
const applyTheme = (id) => setTheme(themeStyles[id]);


return (
<ThemeContext.Provider value={{ theme, applyTheme }}>
{children}
</ThemeContext.Provider>
);
}