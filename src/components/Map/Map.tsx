import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './Map.css';


const labels: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let labelIndex: number = 0;

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
};

const Map: React.FC<MapProps> = ({ style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [zoom, setZoom] = useState<number>(3);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    setClicks([...clicks, e.latLng!]);
    const clickedLocation = e.latLng!;
    setClicks((prevClicks) => [...prevClicks, clickedLocation]);

    const label: string = labels[labelIndex++ % labels.length];
    const marker = new window.google.maps.Marker({
      position: clickedLocation,
      map,
      draggable: true,
      label,
      title: `marker ${label}`,
    });

    marker.addListener('click', () => {
      marker.setMap(null);
      setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker));
    });

    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  // remove all markers by clicking btn.
  const removeAllMarkers = () => {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers([]);
  };

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {
        center,
        zoom,
      }));
    }
  }, [ref, map]);


  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) { map.addListener('click', onClick); }
      if (onIdle) { map.addListener('idle', () => onIdle(map)); }
    }
  }, [map, onClick, onIdle]);


  return (
    <>
      <div ref={ref} style={style} />
      <button type="button" onClick={removeAllMarkers} className="m-1 btn btn-light rounded-1 btn-remove">Remove all markers</button>
    </>
  );
};


export default Map;
