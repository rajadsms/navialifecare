import React from 'react';
import PropTypes from 'prop-types';
import * as Content from '../questionBank.json';

const DisplayTable = (props) => {
  const { question } = Content.default['Question Bank'];
  const { submittedAnswer } = props;
  let arrayToObj = {};

  for (let i = 0; i < question.length; i++) {
    arrayToObj[question[i].id] = question[i];
  }
  let tableHtml = Object.keys(submittedAnswer).map((data, index) => {
    console.log(data, index);
    let answer = submittedAnswer[data];
    let correctAns = arrayToObj[data]['answer'];
    return (
      <tr key={index} className="answerBody">
        <td>{arrayToObj[data].question}</td>
        <td>{arrayToObj[data][answer] ? arrayToObj[data][answer] : 'NA'}</td>
        <td>{arrayToObj[data][correctAns]}</td>
      </tr>
    );
  });
  return (
    <>
      <table>
        <tbody>
          <tr className="NLC-header">
            <td>Question</td>
            <td>Answer</td>
            <td>Correct Answer</td>
          </tr>
          {tableHtml}
        </tbody>
      </table>
    </>
  );
};

DisplayTable.propTypes = {
  submittedAnswer: PropTypes.object,
};
export default DisplayTable;
