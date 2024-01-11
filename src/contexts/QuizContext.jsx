import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();

const SEC_PER_QUESTION = 30;

const initialState = {
  questions: [],
  answer: null,
  points: 0,
  index: 0,
  highscore: 0,
  secondRemaining: null,

  // "Loading, Ready, Error, Active, Finished"
  status: "Loading",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "Ready" };
    case "dataFailed":
      return { ...state, status: "Error" };
    case "start":
      return {
        ...state,
        secondRemaining: state.questions.length * SEC_PER_QUESTION,
        status: "Active",
      };
    case "newAnswer": {
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "Finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "Ready" };
    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("unhandled action type");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, answer, points, index, highscore, secondRemaining, status },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch("http://localhost:9000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    getData();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        answer,
        points,
        index,
        highscore,
        secondRemaining,
        status,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context == "undefined")
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}
export { QuizProvider, useQuiz };
