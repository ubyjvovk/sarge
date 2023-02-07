import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [interval, setInterval] = useState(5);
  const [selectedVoice, setSelectedVoice] = useState('default');

  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
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
