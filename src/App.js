import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({});
  const [intervalId, setIntervalId] = useState(null);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timerStarted, setTimerStarted] = useState(false);

  const startCountdown = (event) => {
    event.preventDefault();

    const validation = () => {
      const currentDate = new Date();
      const maxCountdownDate = new Date(currentDate);
      maxCountdownDate.setDate(maxCountdownDate.getDate() + 99);

      if (selectedDate === "") {
        setErrorMsg("Please select a valid target date and time.");
        stopCountdown();
        return false;;
      }
      const selectedDateTime = new Date(selectedDate);
      if (selectedDateTime  <= new Date() || selectedDateTime  > maxCountdownDate) {
        setErrorMsg(
          "Please select a valid target date and time within the next 99 days."
        );
        stopCountdown();
        return false;;
      }
      return true;
    };
    setCountdownFinished(false);
    if (validation()) {
      setErrorMsg('');
      const interval = setInterval(() => {
        const difference = new Date(selectedDate) - new Date();
        if (difference <= 0) {
          clearInterval(intervalId);
          setCountdownFinished(true);
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          setTimeRemaining({ days, hours, minutes, seconds });
        }
      }, 1000);
      setIntervalId(interval);
      setTimerStarted(true);
    }
  };

  useEffect(() => {
    if (countdownFinished) {
      setTimerStarted(false);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId, countdownFinished]);

  const stopCountdown = () => {
    clearInterval(intervalId);
    setSelectedDate("");
    setTimeRemaining({});
    setTimerStarted(false);
  };

  return (
    <div className="App">
      <h1 style={{color:"#ae00ff"}}><span style={{color:"#fff"}}>Countdown</span> Timer</h1>
      <div>
        <input
        className="picker"
          type="datetime-local"
          id="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          style={{ margin: "1rem" }}
        />
      </div>
      {!timerStarted  && (
      <button style={{ margin: "0.5rem" }} onClick={startCountdown}>
        Start Timer
      </button>
      )}
      {timerStarted && !countdownFinished &&(
        <button style={{ margin: "0.5rem" }} onClick={stopCountdown}>
          Stop Timer
        </button>
      )}
      <div>
        {timeRemaining.days !== undefined && !countdownFinished && (
          <div
            
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h2 className="timerBox">
                {timeRemaining.days}
                <br />
                Days
              </h2>
              <h2 className="timerBox">
                {timeRemaining.hours}
                <br />
                Hours
              </h2>
              <h2 className="timerBox">
                {timeRemaining.minutes}
                <br />
                Minutes
              </h2>
              <h2 className="timerBox">
                {timeRemaining.seconds}
                <br />
                Seconds
              </h2>
            </div>
          </div>
        )}
        {countdownFinished && (
          <div className="finished">
            <p>Countdown is over! What's next in your adventure?</p>            
          </div>
        )}
         {errorMsg !== '' && (
          <div className="error">
            <p>{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
