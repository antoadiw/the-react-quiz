import { useQuiz } from "../contexts/QuizContext";

const Progress = () => {
  const { numQuestions, maxPossiblePoints, index, answer, points } = useQuiz();

  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
};

export default Progress;
