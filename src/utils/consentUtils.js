export const markConsentGiven = () => {
  localStorage.setItem("consent", "yes");
};

export const hasGivenConsent = () => {
  return localStorage.getItem("consent") === "yes";
};
