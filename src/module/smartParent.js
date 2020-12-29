import React from 'react';
import * as Content from '../questionBank.json';
import DisplayTable from './displayTable';
import Timer from './countdown';

class ParentSmart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextQuestion: false,
      question: null,
      tempAnswer: {},
      finalSubmittedAnswer: {},
      displayFlag: false,
    };
    this.gene = this.questionGenerator(Content.default);
    this.timer = null;
    this.changeSubmitAnswer = this.changeSubmitAnswer.bind(this);
    this.updateanswer = this.updateanswer.bind(this);
    this.displayFlagChanger = this.displayFlagChanger.bind(this);
    this.skiptoNext = this.skiptoNext.bind(this);
  }

  componentDidMount() {
    let obj = this.gene.next();
    const timeLimit = Content.default['Question Bank'].timeLimit;
    this.timer = setInterval(() => {
      this.changeSubmitAnswer();
    }, timeLimit * 1000);
    let tempObj = {
      questionId: 1,
      selectedAnswer: 'NA',
    };

    this.setState({
      question: obj.value,
      tempAnswer: tempObj,
    });
  }

  *questionGenerator(data) {
    const questionCount = data['Question Bank'].question.length;
    const questions = data['Question Bank'].question;
    const timeLimit = data['Question Bank'].timeLimit;
    for (let i = 0; i < questionCount; i++) {
      let htmlData = (
        <div
          key={i}
          onChange={this.updateanswer}
          data-question={questions[i].id}
          className="NLC-queAnsDash"
        >
          <Timer timeLimit={timeLimit} />
          <h2 className="questions">{questions[i].question}</h2>

          <div className="NLC-answersRow">
            <div className="NLC-eachQue">
              <input
                type="radio"
                name="answers"
                data-option={'option1'}
              ></input>
              <label>{questions[i].option1}</label>
            </div>
            <div className="NLC-eachQue">
              <input
                type="radio"
                name="answers"
                data-option={'option2'}
              ></input>
              <label>{questions[i].option2}</label>
            </div>
          </div>
          <div className="NLC-answersRow">
            <div className="NLC-eachQue">
              <input
                type="radio"
                name="answers"
                data-option={'option3'}
              ></input>
              <label>{questions[i].option3}</label>
            </div>
            <div className="NLC-eachQue">
              <input
                type="radio"
                name="answers"
                data-option={'option4'}
              ></input>
              <label>{questions[i].option4}</label>
            </div>
          </div>
        </div>
      );
      yield htmlData;
    }
  }
  updateanswer(data) {
    let obj = {
      questionId: data.currentTarget.dataset['question'],
      selectedAnswer: data.target.dataset['option'],
    };
    this.setState({ tempAnswer: obj });
    console.log(data);
  }
  changeSubmitAnswer() {
    let { questionId, selectedAnswer } = this.state.tempAnswer;
    this.setState({
      finalSubmittedAnswer: {
        ...this.state.finalSubmittedAnswer,
        [questionId]: selectedAnswer,
      },
    });
    let obj = this.gene.next();
    console.log(obj);
    if (obj.done) {
      clearInterval(this.timer);
      this.setState({
        displayFlag: true,
      });
    } else {
      this.setState({
        question: obj.value,
        tempAnswer: {
          questionId: obj.value.props['data-question'],
          selectedAnswer: 'NA',
        },
      });
    }
  }

  skiptoNext() {
    let { questionId } = this.state.tempAnswer;
    this.setState({
      finalSubmittedAnswer: {
        ...this.state.finalSubmittedAnswer,
        [questionId]: 'undefined',
      },
    });

    let obj = this.gene.next();

    if (obj.done) {
      this.setState({
        displayFlag: true,
      });
    } else {
      this.setState({
        question: obj.value,
        tempAnswer: {
          questionId: obj.value.props['data-question'],
          selectedAnswer: 'NA',
        },
      });
    }
  }

  displayFlagChanger() {
    if (this.state.displayFlag) {
      this.gene = this.questionGenerator(Content.default);
      let obj = this.gene.next();
      this.timer = setInterval(() => {
        this.changeSubmitAnswer();
      }, 20000);
      this.setState({
        finalSubmittedAnswer: {},
        displayFlag: false,
        question: obj.value,
      });
    } else {
      this.setState({
        displayFlag: true,
      });
    }
  }

  render() {
    const { question, displayFlag, finalSubmittedAnswer } = this.state;
    return (
      <>
        <div>
          {!displayFlag ? (
            <React.Fragment>
              <h1 className="NLC-alignCenter">
                {Content.default['Question Bank'].header}
              </h1>

              {question}
              <div className="NLC-buttonContainer">
                <input
                  type="submit"
                  value="Submit Answer"
                  name="submitAnswer"
                  onClick={this.changeSubmitAnswer}
                />
                <input
                  type="submit"
                  value="Skip Question"
                  name="skipQuestion"
                  onClick={this.skiptoNext}
                />
              </div>
            </React.Fragment>
          ) : (
            'Thank You for taking the Test'
          )}
        </div>

        <input
          type="submit"
          value={displayFlag ? 'Start Test Again' : 'Display Result'}
          onClick={this.displayFlagChanger}
        />

        {displayFlag ? (
          <DisplayTable submittedAnswer={finalSubmittedAnswer} />
        ) : (
          ''
        )}
      </>
    );
  }
}

export default ParentSmart;
