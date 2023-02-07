import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab } from 'react-bootstrap';

const App = () => {
  const voices = ['One', 'Two', 'Three']
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [interval, setNotifInterval] = useState(
    parseInt(localStorage.getItem('interval')) || 5
  );
  const [selectedVoice, setSelectedVoice] = useState(
    localStorage.getItem('selectedVoice') || 'default'
  );
  const [message, setMessage] = useState(
    localStorage.getItem('message') || 'Hey keep working'
  );

  useEffect(() => {
    localStorage.setItem('interval', interval);
    localStorage.setItem('selectedVoice', selectedVoice);
    localStorage.setItem('message', message);
  }, [interval, selectedVoice, message]);

  useEffect(() => {
    let intervalId = null;

    if (isSwitchOn) {
      intervalId = setInterval(() => {
        const msg = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(msg);
      }, interval * 1 * 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isSwitchOn, interval, message]);


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
          <h2 className="text-center mt-5">Notification</h2>
          <p className="text-center mt-3">
            This is a programmable notification timer. You can adjust the
            settings in the "Settings" tab.
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
          <h2 className="text-center mt-5">Settings</h2>
          <div className="form-group mt-5">
            <label htmlFor="intervalRange">Interval (minutes):</label>
            <input
              type="range"
              className="form-control-range"
              id="intervalRange"
              min={5}
              max={30}
              value={interval}
              onChange={handleIntervalChange}
            />
            <p>{interval}</p>
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
                <option key={voice} value={voice}>
                  {voice}
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
        </Tab>
      </Tabs>
    </div>
  );
  };
  
  export default App;