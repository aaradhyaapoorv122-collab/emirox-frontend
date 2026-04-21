// scoringEngine.js
export function evaluateAnswer(question, userAnswer) {
  let score = 0;

  switch (question.type) {
    case "mcq":
    case "truefalse":
      if (userAnswer === question.answer) score = question.marks;
      break;

    case "fill":
      const correctWords = question.answer;
      const matchCount = correctWords.filter(word =>
        userAnswer.toLowerCase().includes(word)
      ).length;

      score =
        matchCount === correctWords.length
          ? question.marks
          : matchCount > 0
          ? question.marks / 2
          : 0;
      break;

    case "assertion":
      if (userAnswer === question.answer) score = question.marks;
      break;

    case "map":
      if (userAnswer === question.answer) score = question.marks;
      break;

    default:
      score = 0;
  }

  return score;
}
