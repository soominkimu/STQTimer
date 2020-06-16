import React, { useRef, useEffect } from 'react';

/*
 * To avoid unnecessarily repeated rendering per second, fire events per each second, minute, hour, and date
 * at the start and then only when the value changes.
 *
 * Cascaded Rendering according to the update cycle
 * callbacks per each timer message should pass down to <TSecond /> that has dispatch function and timer.
 * <TDate />
 *   <THour       dt={} />
 *     <TMinute   dt={} hr={} />
 *       <TSecond dt={} hr={} mm={} />   contains Timer (custom Hook that encapsulates setInterval())
*/

export const lZ = n => (n < 10) ? '0' + n : n.toString();  // leading Zero making a two digit number string
// or use n.toString().padStart(2, "0");  // ES6

const useTimer = callback => {
  const cB = useRef();  // save callback function
  const fireSS = v => cB.current({type: 'TM_SS', payload: v});
  const fireMM = v => cB.current({type: 'TM_MM', payload: v});
  const fireHR = v => cB.current({type: 'TM_HR', payload: v});
  const fireDT = d => cB.current({type: 'TM_DT', payload:
    {
      y: d.getFullYear(),
      m: d.getMonth()+1,
      d: d.getDate(),
      w: d.getDay() // Sun - Sat: 0 - 6
    }
  });

  useEffect(() => {
    cB.current = callback;
    const d0 = new Date();  // Initial setter before setInterval's firing
    fireSS(d0.getSeconds());
    fireMM(d0.getMinutes());
    fireHR(d0.getHours());
    fireDT(d0);
    console.log("useTimer::useEffect: callback set");
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      const ss = d.getSeconds();
      fireSS(ss);
      if (ss === 0) {
        const mm = d.getMinutes();
        fireMM(mm);
        if (mm === 0) {
          const hr = d.getHours();
          fireHR(hr);
          if (hr === 0) {
            fireDT(d);
          }
        }
      }
    }, 1000);
    console.log("useTimer::useEffect: setInterval", id);
    return () => clearInterval(id);
  }, []);
}

export const TSecond = props => {
  console.log("Second()::render");
  const { onMinute, onHour, onDate, onSecond } = props;
  const el = React.useRef(null);  // imperatively accessing DOM
  // make dispatch(action) call reducer(state, action)
  const dispatch = ({type, payload}) => {
    switch (type) {
      case 'TM_SS':
        el.current.setAttribute("data-ss", lZ(payload));  // textContent +1 DOM Node problem
        onSecond && onSecond(payload);
        break;
      case 'TM_MM': onMinute && onMinute(payload); break;
      case 'TM_HR': onHour   && onHour(payload);   break;
      case 'TM_DT': onDate   && onDate(payload);   break;
      default: throw new Error('action not defined!');
    }
  }
  useTimer(dispatch);
  return <span ref={el} id="tm-ss" />;
}

export const TMinute = props => {
  console.log("Minute()::render");
  const { onMinute, ...others } = props; // no to be overwritten
  const el = React.useRef(null);  // to directly access DOM element
  return <>
      <span ref={el} id="tm-mm" />
      <span id="tm-co" />
      <TSecond onMinute={v => {
          el.current.setAttribute("data-mm", lZ(v));
          onMinute && onMinute(v);
        }}
        {...others} />
      </>;
}

export const THour = props => {
  console.log("Hour()::render");
  const { onHour, ...others } = props;
  const el = React.useRef(null);  // to directly access DOM element
  const callback = v => {
    el.current.setAttribute("data-hr", lZ(v));
    onHour && onHour(v);
  }
  return <span id="tm">
      <span ref={el} id="tm-hr" />
      <span id="tm-co" />
      <TMinute onHour={callback} {...others} />
    </span>;
}

export const TDate = props => {
  console.log("Date()::render");
  const { onDate, ...others } = props;
  const el = React.useRef(null);  // to directly access DOM element
  const callback = v => {
    el.current.setAttribute("data-dw", v.w);
    el.current.setAttribute("data-mo", lZ(v.m));
    el.current.setAttribute("data-dd", lZ(v.d));
    el.current.setAttribute("data-yr", lZ(v.y));
    onDate && onDate(v);
  }
  return <div>
      <span ref={el} id="tm-dt" />
      <THour onDate={callback} {...others} />
    </div>;
}

/*
      <TDate dt={ (d) => console.log("Daily job", d) } mm={console.log} />
*/

// get date and time of the specified offset city
export const getDateOffset = offset => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);  // UTC time in msec
  return new Date(utc + (3600000 * offset));
}
