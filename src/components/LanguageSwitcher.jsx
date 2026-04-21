import React from "react";
import i18n from "../i18n/index";

export default function LanguageSwitcher() {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      style={{
        padding: "10px",
        margin: "10px",
        borderRadius: "10px",
        fontSize: "16px",
      }}
      defaultValue={i18n.language}
    >
      <option value="en">English (US)</option>
      <option value="en-AU">English (Australia)</option>
      <option value="hi">Hindi</option>
      <option value="ja">Japanese</option>
      <option value="zh">Chinese</option>
      <option value="ko">Korean</option>
      <option value="ae">Arabic (UAE)</option>
    </select>
  );
}
