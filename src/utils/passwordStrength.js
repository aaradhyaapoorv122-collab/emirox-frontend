export function checkPasswordStrength(password) {
  let score = 0;

  if (!password) return { score: 0, label: "Empty", color: "gray" };

  // length > 8
  if (password.length >= 8) score++;

  // contains letters
  if (/[A-Za-z]/.test(password)) score++;

  // contains numbers
  if (/\d/.test(password)) score++;

  // contains special characters
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = "";
  let color = "";

  switch (score) {
    case 0:
    case 1:
      label = "Weak";
      color = "#ff3b30"; // red
      break;

    case 2:
      label = "Medium";
      color = "#ffcc00"; // yellow
      break;

    case 3:
      label = "Strong";
      color = "#34c759"; // green
      break;

    case 4:
      label = "Very Strong";
      color = "#0a7d07"; // dark green
      break;

    default:
      label = "Weak";
      color = "#ff3b30";
  }

  return { score, label, color };
}
