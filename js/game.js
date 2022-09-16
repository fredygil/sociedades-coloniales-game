import { GameView } from "./game.view.js";
import { questions } from "./dbQuestions.js";
import { GameState } from "./game.state.js";

class Game {
  gameView;
  gameState;
  unusedQuestions;

  start() {
    this.unusedQuestions = questions.map((q) => q);
    this.gameView = new GameView();
    this.gameState = new GameState();
    this.gameView.setState(this.gameState);
    this.gameView.createViews();
    this.gameView.displayCurrentSection();
    this.setEvents();
  }

  setEvents() {
    const events = {
      onSetCurrentSection: () => {
        this.changeCurrentSection();
      },
      onSetSelectedAnswer: () => {
        this.validateAnswer();
      },
      onPlayNext: () => {
        this.playNext();
      },
      onReset: () => {
        this.unusedQuestions = questions.map((q) => q);
      },
    };
    this.gameState.setEvents(events);
  }

  changeCurrentSection() {
    if (this.gameState.getCurrentSection() === "question") {
      const question = this.getQuestion();
      this.gameState.setQuestion(question);
    }
    this.gameView.displayCurrentSection();
  }

  validateAnswer() {
    const answers = this.gameState.getQuestion().answer;
    this.gameState.setIsCorrectAnswer(
      answers[this.gameState.getSelectedAnswer()].correct
    );
    this.gameState.setCurrentSection("answer");
  }

  getQuestion() {
    const numberQuestion = Math.floor(
      Math.random() * this.unusedQuestions.length
    );
    const question = this.unusedQuestions[numberQuestion];
    this.unusedQuestions.splice(numberQuestion, 1);
    return question;
  }

  playNext() {
    if (this.gameState.getIsCorrectAnswer()) {
      if (this.gameState.getQuestionLevel() === 4) {
        this.gameState.setCurrentSection("win");
      } else {
        this.gameState.setQuestionLevel(this.gameState.getQuestionLevel() + 1);
        this.gameState.setCurrentSection("start-question");
      }
    } else {
      this.gameState.setCurrentSection("lose");
    }
  }
}
const game = new Game();
game.start();
