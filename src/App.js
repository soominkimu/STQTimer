// For performance, directly update DOM elements (imperatively)
// not using React rendering cycles.
import React, { useRef, useState } from 'react';
import { lZ, TDate } from './sq-time';
import { TBtn, Webcam } from './webcam';
import './App.scss';

const WorldClock = () => {
  const [showLv, setShowLv] = useState(3);

  const TZ = [
    //'',
    {el: useRef(null), em: useRef(null), lv: 3, cs: '🌴', ct: 'Honolulu',      tz: 'Pacific/Honolulu'},
    {el: useRef(null), em: useRef(null), lv: 1, cs: '💖', ct: 'San Francisco', tz: 'America/Los_Angeles'},
    {el: useRef(null), em: useRef(null), lv: 3, cs: '🏜', ct: 'Denver',        tz: 'America/Denver'},
    {el: useRef(null), em: useRef(null), lv: 3, cs: '🌆', ct: 'Chicago',       tz: 'America/Chicago'},
    {el: useRef(null), em: useRef(null), lv: 2, cs: '🗽', ct: 'New York',      tz: 'America/New_York'},
    {el: useRef(null), em: useRef(null), lv: 3, cs: '💃🏾', ct: 'Buenos Aires',  tz: 'America/Argentina/Buenos_Aires'},
    {el: useRef(null), em: useRef(null), lv: 3, cs: '💂', ct: 'London',        tz: 'Europe/London'},
    {el: useRef(null), em: useRef(null), lv: 2, cs: '🇫🇷', ct: 'Paris',         tz: 'Europe/Paris'},
    {el: useRef(null), em: useRef(null), lv: 3, cs: '🥃', ct: 'Moscow',        tz: 'Europe/Moscow'},
    {el: useRef(null), em: useRef(null), lv: 3, cs: '🇨🇳', ct: 'Shanghai',      tz: 'Asia/Shanghai'},
    {el: useRef(null), em: useRef(null), lv: 1, cs: '🗼', ct: 'Tokyo',      tz: 'Asia/Tokyo'},
    {el: useRef(null), em: useRef(null), lv: 3, cs: '🇦🇺', ct: 'Melbourne',     tz: 'Australia/Melbourne'},
  ].filter(z => z.lv <= showLv);

  const updateHour = () => {  // onHour change
    TZ.forEach( z => {
      const d = new Date(new Date().toLocaleString('en-US', {timeZone: z.tz}));
      z.el.current.setAttribute("data-dw", d.getDay());
      z.el.current.setAttribute("data-mo", lZ(d.getMonth()+1));
      z.el.current.setAttribute("data-dd", lZ(d.getDate()));
      z.el.current.setAttribute("data-yr", lZ(d.getFullYear()));
      z.el.current.setAttribute("data-hr", lZ(d.getHours()));
    });
  }
  /*
      '<span id="tm-sd" data-dw=' + d.getDay()          +
                      ' data-mo=' + lZ(d.getMonth()+1)  +
                      ' data-dd=' + lZ(d.getDate())     +
                      ' data-yr=' + lZ(d.getFullYear()) + '></span> ' +
      '<span id="tm-hr" data-dw=' + d.getDay()          +
                      ' data-hr=' + lZ(d.getHours())    + '></span>';
   * */

  const updateMinute = m => {  // onMinute change
    //const nowTZ = d => lZ(d.getMinutes());  // Most of countries will be ok with the same minute
    TZ.forEach( z => z.em.current.setAttribute("data-mm", lZ(m)) );
  }

  return (
    <>
      <h1>World Clock</h1>
      <TBtn
        onClick={ ()=>setShowLv((showLv + 1) % 4) }>
        Toggle Cities ({showLv})
      </TBtn>
      <TDate
        onDate={ d => console.log("Daily job", d) }
        onHour={updateHour}
        onMinute={m => updateMinute(m)}
      />
      {TZ.map((z, i) =>
        <li key={i}>
          <span id="tm-ct" data-ct={z.ct} data-cs={z.cs} />
          <span ref={z.el} id="tm-sd" />
          <span id="tm-co" />
          <span ref={z.em} id="tm-dm" />
        </li>)}
    </>
  );
}

const WebcamTest = () => {
  const [webcam, setWebcam] = useState(false);
  const [face,   setFace]   = useState(true);

  return (
    <>
      <TBtn
        onClick={ ()=>setWebcam(!webcam) }>
        Webcam {webcam ? 'Off' : 'On'}
      </TBtn>
      <TBtn
        disabled={!webcam}
        onClick={ ()=>setFace(!face) }>
        Face {face ? 'Environment' : 'User'}
      </TBtn>
      {webcam && <Webcam bUser={face} />}
    </>
  );
}

function App() {
  console.log("App()::render");

  return (
    <div className="App">
      <WorldClock />
      <WebcamTest />
    </div>
  );
}

//  <span role="img" aria-label="city">{z.cs}</span>

export default App;
