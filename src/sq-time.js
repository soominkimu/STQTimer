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

export const lZ = n => (n < 10) ? '0' + n : n.toString();

const useTimer = callback => {
  const cB = useRef();

  useEffect(() => {
    cB.current = callback;
  }, [callback]);

  useEffect(() => {
    const fireSS = v => cB.current({type: 'TM_SS', payload: v});
    const fireMM = v => cB.current({type: 'TM_MM', payload: v});
    const fireHR = v => cB.current({type: 'TM_HR', payload: v});
    const fireDT = v => cB.current({type: 'TM_DT', payload: v});
    const df = new Date();  // Initial setter before setInterval's firing
    fireSS(df.getSeconds());
    fireMM(df.getMinutes());
    fireHR(df.getHours());
    fireDT(df.getDate());

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
            const dt = d.getDate();
            fireDT(dt);
          }
        }
      }
    }, 1000);
    console.log("useEffect()", id);
    return () => clearInterval(id);
  }, []);
}

export const TSecond = props => {
  console.log("Second()::render");
  //const [state, setState] = useState(0);
  const el = React.useRef(null);  // imperatively accessing DOM
  const setState = v => el.current.textContent = lZ(v);
  const callback = v => { setState(v); props.onSecond && props.onSecond(v); }

  const dispatch = ({type, payload}) => {
    switch (type) {
      case 'TM_SS': callback(payload); break;
      case 'TM_MM': props.onMinute && props.onMinute(payload); break;
      case 'TM_HR': props.onHour   && props.onHour(payload);   break;
      case 'TM_DT': props.onDate   && props.onDate(payload);   break;
      default: throw new Error('Unexpected action!');
    }
  }
  useTimer(dispatch);
  return <span ref={el}></span>;
}

export const TMinute = props => {
  console.log("Minute()::render");
  const { onMinute, ...others } = props; // no to be overwritten
  //const [state, setState] = useState(0);
  const el = React.useRef(null);
  const setState = v => el.current.textContent = lZ(v);
  const callback = v => { setState(v); onMinute && onMinute(v); }
  return <><span ref={el}></span>:<TSecond onMinute={callback} {...others} /></>;
}

export const THour = props => {
  console.log("Hour()::render");
  const { onHour, ...others } = props;
  //const [state, setState] = useState(0);
  const el = React.useRef(null);
  const setState = v => el.current.textContent = lZ(v);
  const callback = v => { setState(v); onHour && onHour(v); }
  return <><span ref={el}></span>:<TMinute onHour={callback} {...others} /></>;
}

export const TDate = props => {
  console.log("Date()::render");
  const { onDate, ...others } = props;
  //const [state, setState] = useState(0);
  const el = React.useRef(null);
  const setState = v => el.current.textContent = lZ(v);
  const callback = v => { setState(v); onDate && onDate(v); }
  return <div><span ref={el}></span> <THour onDate={callback} {...others} /></div>;
}

/*
      <TDate dt={ (d) => console.log("Daily job", d) } mm={console.log} />
*/
