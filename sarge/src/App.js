import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  
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
        console.log("")
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
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="switch">Turn On/Off:</label>
            <button id="switch" className="btn btn-primary" onClick={handleSwitchChange}>
              {isSwitchOn ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="interval">Notification Interval (minutes):</label>
            <input
              type="range"
              id="interval"
              min={5}
              max={30}
              value={interval}
              onChange={handleIntervalChange}
              className="form-control-range"
            />
            <span>{interval}</span>
          </div>
        </div>
      </div>

      <div className="form-group">
      <label htmlFor="messageInput">Voice Message</label>
      <input
        type="text"
        className="form-control"
        id="messageInput"
        value={message}
        onChange={handleMessageChange}
        />
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="voice">Voice:</label>
            <select id="voice" className="form-control" value={selectedVoice} onChange={handleVoiceChange}>
              <option value="default">Default</option>
              <option value="voice1">Voice 1</option>
              <option value="voice2">Voice 2</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
