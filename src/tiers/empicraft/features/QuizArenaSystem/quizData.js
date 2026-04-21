// quizData.js
export const quizPaper = {
  subject: "Science",
  chapter: "Light",
  totalMarks: 40,
  sections: [
    {
      title: "Section A – MCQs",
      questions: [
        {
          id: "mcq1",
          type: "mcq",
          difficulty: "easy",
          marks: 1,
          question: "Which mirror is used in vehicles?",
          options: ["Concave", "Convex", "Plane", "None"],
          answer: "Convex",
        },
      ],
    },

    {
      title: "Section B – True / False",
      questions: [
        {
          id: "tf1",
          type: "truefalse",
          difficulty: "easy",
          marks: 1,
          question: "Light travels in a straight line.",
          answer: true,
        },
      ],
    },

    {
      title: "Section C – Fill in the Blanks",
      questions: [
        {
          id: "fib1",
          type: "fill",
          difficulty: "medium",
          marks: 2,
          question: "The bending of light is called ____.",
          answer: ["refraction"],
        },
      ],
    },

    {
      title: "Section D – Assertion Reason",
      questions: [
        {
          id: "ar1",
          type: "assertion",
          difficulty: "medium",
          marks: 3,
          assertion: "Concave mirrors can form real images.",
          reason: "They converge light rays.",
          answer: "both-true-related",
        },
      ],
    },

    {
      title: "Section E – Map Based",
      questions: [
        {
          id: "map1",
          type: "map",
          difficulty: "hard",
          marks: 5,
          question: "Mark the Tropic of Cancer.",
          answer: "tropic_of_cancer",
        },
      ],
    },
  ],
};
