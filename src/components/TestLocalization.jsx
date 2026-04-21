import React from "react";
import { useTranslation } from "react-i18next";

const TestLocalization = () => {
  const { t } = useTranslation("common");

  return (
    <div style={{ marginTop: "20px", fontSize: "20px" }}>
      {t("welcome")}
    </div>
  );
};

export default TestLocalization;
