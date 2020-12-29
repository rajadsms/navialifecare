import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const Timer = (props) => {
  const { timeLimit } = props;
  const [timer, setTimer] = useState(timeLimit);

  useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
  }, [timer]);

  return (
    <p className="NLC-rightAlign">
      <div>Please mind the time limit</div>
      <span>{timer}</span>
    </p>
  );
};
Timer.propTypes = {
  timeLimit: PropTypes.string,
};
export default Timer;
