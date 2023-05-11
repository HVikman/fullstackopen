import { useState } from "react";

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Feedback</h1>
      <Button handleClick={() => setGood(good + 1)} txt="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} txt="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} txt="Bad" />
      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;

const Statistics = (props) => {
  let good = props.good;
  let bad = props.bad;
  let neutral = props.neutral;

  let total = good + bad + neutral;
  let average = (good - bad) / total;
  let positive = (good / total) * 100;
  if (total > 0) {
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text="Good" value={good} />
            <StatisticLine text="Neutral" value={neutral} />
            <StatisticLine text="Bad" value={bad} />
            <StatisticLine text="Average" value={average} />
            <StatisticLine text="Positive" value={positive} />
          </tbody>
        </table>
      </div>
    );
  } else {
    return <p>No feedback yet</p>;
  }
};

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.txt}</button>;
};
const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};
