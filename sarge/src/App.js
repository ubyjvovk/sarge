import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab } from 'react-bootstrap';

// const voices = [];
// const populateVoices = () => {
//   voices.length = 0;
//   console.log("cleaned voices:", voices);
//   for(const voice of window.speechSynthesis.getVoices()) voices.push(voice);
//   console.log("loaded voices:", voices);
// };


const App = () => {
  
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [interval, setNotifInterval] = useState(
    parseInt(localStorage.getItem('interval')) || 5
  );
  const [selectedVoice, setSelectedVoice] = useState(
    localStorage.getItem('selectedVoice') || 'Daniel'
  );
  const [message, setMessage] = useState(
    localStorage.getItem('message') || 'If you\'re not being productive right now, do 20 pushups!!!'
  );
  const [yellCount, setYellCount] = useState(0);
  const [voices, setVoices] = useState([]);

  console.log('NEW RENDER with voices:', voices);

  if (voices.length === 0 && window.speechSynthesis.onvoiceschanged !== undefined) {
    console.log("setting timeout");
    setTimeout(()=> {
      setVoices(window.speechSynthesis.getVoices());
    }, 25);
  }
 
  // getVoices();  // Firefox needs an attempt to get voices before populating them
  // window.speechSynthesis.onvoiceschanged = getVoices;

  useEffect(() => {
    localStorage.setItem('interval', interval);
    localStorage.setItem('selectedVoice', selectedVoice);
    localStorage.setItem('message', message);
  }, [interval, selectedVoice, message]);

  // const shout3 = useCallback(() => {
  //     const utterance = new SpeechSynthesisUtterance(message);
  //     utterance.voice = voices.find(voice => voice.name === selectedVoice);
  //     console.log(voices, selectedVoice);
  //     console.log("uuuu", utterance);
  //     window.speechSynthesis.speak(utterance);
  //   }, [selectedVoice, message, voices]);

  const shout = useCallback((e) => {
      if (e) e.preventDefault();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.voice = voices.find(voice => voice.name === selectedVoice);
      // console.log(voices, selectedVoice);
      // console.log("uuuu", utterance);
      console.log("Shout:", message);
      window.speechSynthesis.speak(utterance);
  }, [voices, selectedVoice, message]);
  // window.speechSynthesis.getVoices(); //because Firefox
  // setTimeout(()=>{setVoices(window.speechSynthesis.getVoices())}, 10);

    // 


  useEffect(() => {
    let intervalId = null;

    if (isSwitchOn) {
      const randomInterval = Math.random() * 2 * interval * 1; // uniformly random with mean == interval
      console.log('next yell in ', randomInterval);
      intervalId = setTimeout(() => {
        shout();
        setYellCount(yellCount + 1); //also rearms the notification, as this useEffect depends on yellCount
      }, randomInterval*1000);  // because milliseconds
    } else {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isSwitchOn, interval, yellCount, message, selectedVoice, voices, shout]); // no need to depend on message and voice, shout deps on them

  
  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const handleIntervalChange = (event) => {
    setNotifInterval(event.target.value);
  };

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  return (
    <div className="container mt-5">
      <Tabs defaultActiveKey="main" id="uncontrolled-tab-example">
        <Tab eventKey="main" title="Drill Sergeant">
          <h2 className="text-center mt-5">Drill Sergeant</h2>
          <p className="mt-3">
          This is a programmable notification timer that reminds you to stay focused and on track while working. 
          </p>
          <p className="mt-3">
          Sarge will yell at you periodically (at random, around the interval you set), and you will obey.
          </p>
          <p>
            {isSwitchOn ? `The heat is on! Will yell every ${interval} minutes on average, ${yellCount} yells so far` : "Sarge is asleep"}
          </p>
          <div className="d-flex justify-content-center mt-5">
            <button
              className={`btn btn-${isSwitchOn ? "danger" : "success"} btn-lg`}
              onClick={handleSwitchChange}
            >
              {isSwitchOn ? "Turn Off" : "Turn On"}
            </button>
          </div>
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <form className='form-inline'>

          <h2 className="text-center mt-5">Settings</h2>

          <div className="form-group mt-5">
            <label htmlFor="intervalRange">Interval (minutes): </label>
            <input
              type="range"
              className="form-control-range"
              id="intervalRange"
              min={1}
              max={300}
              value={interval}
              onChange={handleIntervalChange}
            />
            {interval}
          </div>

          <div className="form-group">
            <label htmlFor="voiceSelect">Voice:</label>
            <select
              className="form-control"
              id="voiceSelect"
              value={selectedVoice}
              onChange={handleVoiceChange}
            >
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="messageInput">Message:</label>
            <input
              type="text"
              className="form-control"
              id="messageInput"
              value={message}
              onChange={handleMessageChange}
            />
          </div>
          <div className="form-group">
            <button formAction=''
              className='btn btn-primary'
              onClick={shout}
            >
              Try it
            </button>
          </div>
          </form>

        </Tab>
      </Tabs>
    </div>
  );
};

export default App;