import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [votes, setVote] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [selected, setSelected] = useState(0);
  const [best, setBest] = useState(0);

  console.log(selected);
  console.log(votes);

  const handleClick = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVote(copy);

    if (copy[selected] > copy[best]) {
      setBest(selected);
    }
    console.log(best);
  };

  return (
    <div>
      <div>
        {anecdotes[selected]}
        <p>has {votes[selected]} votes</p>
        <br />
        <button onClick={handleClick}>vote</button>
        <button onClick={() => setSelected(Math.floor(Math.random() * 8))}>
          Next anecdote
        </button>
      </div>
      <hr />
      <div>
        {anecdotes[best]}
        <p>best anecdote has {votes[best]} votes</p>
      </div>
    </div>
  );
};

export default App;
