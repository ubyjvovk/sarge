import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab} from 'react-bootstrap';

const App = () => {

  const [activeTab, setActiveTab] = useState('hero');
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
    console.log("will wait for voices to load");
    setTimeout(() => {
      setVoices(window.speechSynthesis.getVoices());
    }, 100);
  }

  useEffect(() => {
    localStorage.setItem('interval', interval);
    localStorage.setItem('selectedVoice', selectedVoice);
    localStorage.setItem('message', message);
  }, [interval, selectedVoice, message]);


  const shout = useCallback((e) => {
    if (e) e.preventDefault();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = voices.find(voice => voice.name === selectedVoice);
    console.log("Shout:", message);
    window.speechSynthesis.speak(utterance);
  }, [voices, selectedVoice, message]);


  useEffect(() => {
    let intervalId = null;

    if (isSwitchOn) {
      const randomInterval = Math.random() * 2 * interval * 1; // uniformly random with mean == interval
      console.log('next yell in ', randomInterval);
      intervalId = setTimeout(() => {
        shout();
        setYellCount(yellCount + 1); //also rearms the notification, as this useEffect depends on yellCount
      }, randomInterval * 1000);  // because milliseconds
    } else {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isSwitchOn, interval, yellCount, message, selectedVoice, voices, shout]); // no need to depend on message and voice, shout deps on them

  const switchTabs = () => {
    setActiveTab(activeTab === 'hero' ? 'settings' : 'hero');
  }

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
    <div className="container-sm mt-5">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first" activeKey={activeTab}>
        <Tab.Content>
          <Tab.Pane eventKey="hero" title='hero'>
            <div class="container my-5">
              <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
                <div class="col-lg-5 p-3 p-lg-5 pt-lg-3">
                  <h1 class="display-4 fw-bold lh-1 mb-5">Your Personal Drill Sergeant</h1>
                  <p class='lead'> Sarge will keep you fit and productive</p>
                  <p class='lead'>
                    He will check on you periodically (at random, around the interval you set), and if you're not working, you must pay the price.
                  </p>

                  <p class='lead'>
                    In other words, this is a programmable notification timer that reminds you to stay focused and on track.
                  </p>

                  <p class='lead mb-5 fw'>
                    {isSwitchOn ? `The heat is on! Will yell every ${interval} minutes on average, ${yellCount} yells so far` : "Sarge is asleep"}
                  </p>

                  <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">


                    <button type="button"
                      className={`btn btn-lg px-4 me-md-2 fw-bold btn-${isSwitchOn ? "danger" : "success"} btn-lg`}
                      onClick={handleSwitchChange}
                    >
                      {isSwitchOn ? "Turn Off" : "Turn On"}
                    </button>


                    <button type="button" class="btn btn-outline-secondary btn-lg px-4" onClick={switchTabs}>Settings</button>
                  </div>
                </div>
                <div class="col-lg-5 offset-lg-2 p-0 overflow-hidden shadow-lg">
                  <img class="rounded-lg-3" src="/sarge/sarge2.png" alt="" width='512' />
                </div>
              </div>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="settings" title="Settings">
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
            <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3 mt-3">

              <a class="btn btn-outline-secondary btn-small px-4" onClick={switchTabs}> {'< Back'} </a>
            </div>

          </Tab.Pane>




        </Tab.Content>
      </Tab.Container>

    </div>
  );
};

export default App;