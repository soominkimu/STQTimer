import React, { useRef } from 'react';
import { lZ, TDate } from './sq-time';
import './App.scss';

function App() {
  console.log("App()::render");
  const TZ = [
    //'',
    {el: useRef(null), em: useRef(null), cs: '🇦🇺', ct: 'Melbourne',     tz: 'Australia/Melbourne'},
    {el: useRef(null), em: useRef(null), cs: '🗼', ct: 'Tokyo',      tz: 'Asia/Tokyo'},
    {el: useRef(null), em: useRef(null), cs: '🇨🇳', ct: 'Shanghai',      tz: 'Asia/Shanghai'},
    {el: useRef(null), em: useRef(null), cs: '🥃', ct: 'Moscow',        tz: 'Europe/Moscow'},
    {el: useRef(null), em: useRef(null), cs: '🇫🇷', ct: 'Paris',         tz: 'Europe/Paris'},
    {el: useRef(null), em: useRef(null), cs: '💂', ct: 'London',        tz: 'Europe/London'},
    {el: useRef(null), em: useRef(null), cs: '💃🏾', ct: 'Buenos Aires',  tz: 'America/Argentina/Buenos_Aires'},
    {el: useRef(null), em: useRef(null), cs: '🗽', ct: 'New York',      tz: 'America/New_York'},
    {el: useRef(null), em: useRef(null), cs: '🌆', ct: 'Chicago',       tz: 'America/Chicago'},
    {el: useRef(null), em: useRef(null), cs: '🏜', ct: 'Denver',        tz: 'America/Denver'},
    {el: useRef(null), em: useRef(null), cs: '💖', ct: 'San Francisco', tz: 'America/Los_Angeles'},
    {el: useRef(null), em: useRef(null), cs: '🌴', ct: 'Honolulu',      tz: 'Pacific/Honolulu'},
  ];

  const tzDate = tz => new Date(new Date().toLocaleString('en-US', {timeZone: tz}));

  const updateHour = () => {  // onHour change
    const nowTZ = d =>
      '<span id="tm-sd" data-dw=' + d.getDay()          +
                      ' data-mo=' + lZ(d.getMonth()+1)  +
                      ' data-dd=' + lZ(d.getDate())     +
                      ' data-dd=' + lZ(d.getFullYear()) + '></span> ' +
      '<span id="tm-hr" data-hr=' + lZ(d.getHours())    + '></span>';
    TZ.forEach( z => z.el.current.innerHTML = nowTZ(tzDate(z.tz)) );
  }

  const updateMinute = (m) => {  // onMinute change
    //const nowTZ = d => lZ(d.getMinutes());  // Most of countries will be ok with the same minute
    TZ.forEach( z => z.em.current.setAttribute("data-mm", lZ(m)) );
  }

  return (
    <div className="App">
      <h1>Timer</h1>
      <TDate
        onDate={ d => console.log("Daily job", d) }
        onHour={updateHour}
        onMinute={m => updateMinute(m)}
      />
      {TZ.map((z, i) => <li key={i}>
          <span id="tm-ct">{z.ct}</span>
          <span role="img" aria-label="city">{z.cs}</span>
          <span ref={z.el} /><span id="tm-co" />
          <span ref={z.em} id="tm-mm" />
        </li>)}
    </div>
  );
}

export default App;
