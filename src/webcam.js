import React, { useRef, useEffect } from 'react';

export const Webcam = ({bUser=true}) => {
  console.log("Webcam::render");
  const rVE    = useRef(null);  // ref to Video Element
  const rTitle = useRef(null);
  // 'mediaDevices' not supported in mobile Android and Amazon Fire tablet
  const constraints = { video: { facingMode: bUser ? 'user' : 'environment' }};

  useEffect(() => {
    const mediaAvailable = () => 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

    if (mediaAvailable()) {
      let videoStream;
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          const videoTracks = stream.getVideoTracks();
          rTitle.current.setAttribute('data-src', 'Source:' + videoTracks[0].label);
          console.log('Using video device: ' + videoTracks[0].label); // FaceTime HD Camera (Built-in)
          stream.onremovetrack = function() {
            console.log('Stream ended');
          }
          //window.stream = stream;
          rVE.current.srcObject = stream;
          videoStream = stream;
        })
        .catch(function(error) {
          console.log(error.name);
          if (typeof error !== 'undefined')
            console.error(error);
        });
      return () => {  // unsure this part is needed ... 
        if (videoStream) {
          const tracks = videoStream.getTracks();
          tracks.forEach(tr => tr.stop());
          videoStream = null;
        }
      }
    } else {
      alert("mediaDevices not supported!");
    }
  }, [constraints])

  const aSize = [
    {width: '70%',   height: '70%'},
    {width: '50%',   height: '50%'},
    {width: '300px', height: '200px'},
    {width: '100%',  height: '100%'},
  ];

  const aFilter = [
    "sepia(100%)",
    "grayscale(100%)",
    "blur(4px)",
    "brightness(3.5)",
    "opacity(.4)",
    "invert(75%)",
    "drop-shadow(16px 16px 20px blue)",
    "hue-rotate(90deg)",
  ];

  const aTrans = [
    "rotateY(180deg)",
    "rotateY(0deg)",
    "rotateZ(90deg)",
    "rotateZ(180deg)",
    "rotateZ(-45deg)",
    "rotateX(20deg) rotateY(-45deg)",
  ];

  const aShape = [
    "50%",
    "25%",
    "5%",
    "0",
  ];

  const sz = useRef(0);  // size index
  const ft = useRef(0);  // filter index
  const tr = useRef(0);  // transform index
  const sh = useRef(0);  // shape index

  const handleSize = () => {
    const i = sz.current++ % aSize.length
    rVE.current.style.width  = aSize[i].width;
    rVE.current.style.height = aSize[i].height;
  }
  const handleFilter = () => { rVE.current.style.filter       = aFilter[ft.current++ % aFilter.length]; }
  const handleTrans  = () => { rVE.current.style.transform    = aTrans[ tr.current++ % aTrans.length]; }
  const handleShape  = () => { rVE.current.style.borderRadius = aShape[ sh.current++ % aShape.length]; }
  const handleReset  = () => { rVE.current.setAttribute("style", ""); }

  return (
    <div ref={rTitle} className="vid-cont">
      <video ref={rVE} playsInline={true} autoPlay={true} controls={true} className="vid-fw" />
      <TBtn onClick={ () => handleSize() }>Size</TBtn>
      <TBtn onClick={ () => handleFilter() }>Filter</TBtn>
      <TBtn onClick={ () => handleTrans() }>Transform</TBtn>
      <TBtn onClick={ () => handleShape() }>Shape</TBtn>
      <TBtn onClick={ () => handleReset() }>Reset</TBtn>
    </div>
  );
}

export const TBtn = props => <button type="button" className="test-btn" {...props}>{props.children}</button>;
