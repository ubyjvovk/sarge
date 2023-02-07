import React, { useState } from 'react';

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
    <div>
      <div>
        <label htmlFor="switch">Turn On/Off:</label>
        <button id="switch" onClick={handleSwitchChange}>
          {isSwitchOn ? 'Turn Off' : 'Turn On'}
        </button>
      </div>

      <div>
        <label htmlFor="interval">Notification Interval (minutes):</label>
        <input
          type="range"
          id="interval"
          min={5}
          max={30}
          value={interval}
          onChange={handleIntervalChange}
        />
        <span>{interval}</span>
      </div>

      <div>
        <label htmlFor="voice">Voice:</label>
        <select id="voice" value={selectedVoice} onChange={handleVoiceChange}>
          <option value="default">Default</option>
          <option value="voice1">Voice 1</option>
          <option value="voice2">Voice 2</option>
        </select>
      </div>
    </div>
  );
};

export default App;
