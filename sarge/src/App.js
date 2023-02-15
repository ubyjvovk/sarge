import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab } from 'react-bootstrap';
import {MarkGithubIcon} from '@primer/octicons-react';

const App = () => {

  const [activeTab, setActiveTab] = useState('hero');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [interval, setNotifInterval] = useState(
    parseInt(localStorage.getItem('interval')) || 10
  );
  const [selectedVoice, setSelectedVoice] = useState(
    localStorage.getItem('selectedVoice') || 'Daniel'
  );
  const [messagesText, setMessagesText] = useState(
    localStorage.getItem('message') || "If you're not being productive right now, do 20 pushups!!!\nIf you're not working, do 20 lunges!"
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
    localStorage.setItem('message', messagesText);
  }, [interval, selectedVoice, messagesText]);


  const shout = useCallback((e) => {
    if (e) e.preventDefault();
    const messages = messagesText.trim().split('\n');
    const actualMessage = messages[(Math.random() * messages.length) | 0]  // |0 converts to int
    const utterance = new SpeechSynthesisUtterance(actualMessage);
    utterance.voice = voices.find(voice => voice.name === selectedVoice);
    console.log("Shout:", actualMessage);
    window.speechSynthesis.speak(utterance);
  }, [voices, selectedVoice, messagesText]);


  useEffect(() => {
    let intervalId = null;

    if (isSwitchOn) {
      const randomInterval = Math.random() * 2 * interval * 60; // uniformly random with mean == interval
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
  }, [isSwitchOn, interval, yellCount, messagesText, selectedVoice, voices, shout]); // no need to depend on message and voice, shout deps on them

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
    setMessagesText(event.target.value);
  };

  return (
    <div className="container-sm mt-5">
      <Tab.Container id="tab-contrainer" activeKey={activeTab}>
        <Tab.Content>
          <Tab.Pane eventKey="hero" title='hero'>
            <div className="container my-5">
              <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">

                <div className="col-lg-5 p-3 p-lg-5 pt-lg-3">
                  <h1 className="display-5 fw-bold lh-1 mb-5">Your Personal Drill Sergeant</h1>
                  <p className='lead'>Sarge will keep you fit and productive</p>
                  <p className='lead'>
                    He will check on you periodically (at random, around the interval you set), and if you're not working, you must pay the price.
                  </p>
                  {/* <p className='lead'>
                    In other words, this is a programmable notification timer that reminds you to stay focused and on track.
                  </p> */}
                  <p className='lead mb-5 fw-bold'>
                    {isSwitchOn ? `Sarge will shout every ${interval} minutes on average, ${yellCount} times so far` : "Sarge is asleep"}
                  </p>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                    <button type="button"
                      className={`btn btn-lg px-4 me-md-2 fw-bold btn-${isSwitchOn ? "danger" : "success"} btn-lg`}
                      onClick={handleSwitchChange}
                    >
                      {isSwitchOn ? "Stop" : "Start"}
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={switchTabs}>Settings</button>
                  </div>

                </div>

                <div className="col-lg-5 offset-lg-2 p-0 mb-4 overflow-hidden ">
                  <img className="rounded mx-auto d-block " src="/sarge/sarge2.png" alt=""  />
                  <p className="text-end small gap-1 ">
                    made by ubyjvovk 
                    <a class="text-end small me-2 ms-1" href="https://github.com/ubyjvovk/sarge"><MarkGithubIcon size={16} /></a>
                  </p>
                </div>
              </div>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="settings" title="Settings">
            <div className="container my-5">
              <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
                <h1 className="display-7 fw-bold lh-1 mb-3">Settings</h1>
                <form className='form'>
                  <div className="row mb-3 mt-3">
                    <label htmlFor="customRange2" className="col-sm-2 col-form-label">Interval:</label>
                    <div className="col-sm-8">
                      <input type="range" className="form-range mt-2" min={1} max={300} id="customRange2"
                        value={interval} onChange={handleIntervalChange} aria-describedby="intervalHelp" />
                      <div id="intervalHelp" className="form-text">Average interval between random checks</div>
                    </div>
                    <label htmlFor="customRange2" className="col-sm-2 col-form-label">{interval} minute(s)</label>
                  </div>

                  <div className="row mb-3 mt-4">
                    <label htmlFor="colFormLabel" className="col-sm-2 col-form-label">Voice</label>
                    <div className="col-sm-10">
                      <select
                        className="form-control"
                        id="voiceSelect"
                        value={selectedVoice}
                        onChange={handleVoiceChange}
                        aria-describedby="voicesHelp"
                      >
                        {voices.map(voice => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                      <div id="voicesHelp" className="form-text">Voices list might be empty in Safari, Sarge will still work</div>
                    </div>
                  </div>

                  <div className="row mb-3 mt-4">
                    <label htmlFor="messageInput" className="col-sm-2 col-form-label">Message:</label>
                    <div className="col-sm-10">
                      <textarea
                        type="textarea"
                        className="form-control"
                        id="messageInput"
                        value={messagesText}
                        onChange={handleMessageChange}
                        aria-describedby="messagesHelp"
                      />
                      <div id="messagesHelp" className="form-text">One message per line. Randomly chosen for each check.</div>

                      <button formAction=''
                        className='btn mt-1 btn-primary'
                        onClick={shout}
                      >
                        Try it
                      </button>
                    </div>
                  </div>
                </form>
                <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-1 mb-lg-3 mt-4">
                  <button className="btn btn-outline-secondary btn-small px-4" onClick={switchTabs} aria-describedby="backHelp">
                    {'< Back'}
                  </button>
                </div>
                <div id="backHelp" className="form-text">changes are saved automatically in your local storage</div>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default App;