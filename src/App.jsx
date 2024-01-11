import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Footer from "./components/Footer";
import Progress from "./components/Progress";
import NextButton from "./components/NextButton";
import FinishScreen from "./components/FinishScreen";
import Timer from "./components/Timer";
import { useQuiz } from "./contexts/QuizContext";

function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "Loading" && <Loader />}
        {status === "Error" && <Error />}
        {status === "Ready" && <StartScreen />}
        {status === "Active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <NextButton />
              <Timer />
            </Footer>
          </>
        )}
        {status === "Finished" && <FinishScreen />}
      </Main>
    </div>
  );
}

export default App;
