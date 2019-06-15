import React from 'react';
import { lZ, TDate } from './sq-time';
import './App.scss';


/*
const Second = () => {
  const getSec = (date = new Date()) => leadZero(date.getSeconds());
  const [sec, setSec] = useState(getSec());

  useEffect(() => {
    const id = setInterval(() => {
      setSec(getSec());
    }, 1000);
    console.log("useEffect()", id);
    return () => clearInterval(id);
  }, []);

  return <span>{sec}</span>;
}

const Timer = () => {

  const getTime = (date = new Date()) => ({
    yr: date.getFullYear(),
    mm: leadZero(date.getMonth()+1),
    dd: leadZero(date.getDate()),
    hr: leadZero(date.getHours()),
    mi: leadZero(date.getMinutes()),
    se: leadZero(date.getSeconds())
  });

  const [tm, setTm] = useState(getTime());

  useEffect(() => {
    const id = setInterval(() => {
      setTm(getTime());
    }, 60*1000);
    console.log("useEffect()", id);
    return () => clearInterval(id);
  }, []);

  return <div>{tm.yr}/{tm.mm}/{tm.dd} {tm.hr}:{tm.mi}:{<Second />}</div>;
}
*/

function App() {
  console.log("App()::render");
  const aEl = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
  ];

  const updateClocks = () => {
    const TZ = [
      //'Asia/Tokyo',
      'Australia/Melbourne',
      'Europe/Paris',
      'America/New_York',
      'America/Los_Angeles',
    ];
    const nowTZ = tz => {
      let d = new Date().toLocaleString('en-US', {timeZone: tz});
      d = new Date(d);
      return lZ(d.getMonth()) + '/' + lZ(d.getDate()) + ' '
           + lZ(d.getHours()) + ':' + lZ(d.getMinutes());
    }
    TZ.forEach((tz, i) => aEl[i].current.textContent = nowTZ(tz));
  }

  return (
    <div className="App">
      <h1>Timer</h1>
      <TDate
        onDate={ d => console.log("Daily job", d) }
        onMinute={updateClocks}
      />
      <div>Melbourne  :<span ref={aEl[0]}></span></div>
      <div>Paris      :<span ref={aEl[1]}></span></div>
      <div>New York   :<span ref={aEl[2]}></span></div>
      <div>Los Angeles:<span ref={aEl[3]}></span></div>
    </div>
  );
}

export default App;
