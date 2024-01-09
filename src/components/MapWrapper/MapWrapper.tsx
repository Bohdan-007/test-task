import React from 'react';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from '../Map/Map';


const API_KEY: string = 'AIzaSyCwPrFHf7ocdSNu2XRorp-pKq15iHD8vzk';

const MapWrapper: React.FC = () => {
  const render = (status: Status) => {
    console.log(status);
    return <h1>{status}</h1>;
  };

  const style = {
    height: '100vh',
    width: '100%'
  };


  return (
    <Wrapper apiKey={API_KEY} render={render} >
      <Map style={style} />
    </Wrapper>
  );
};


export default MapWrapper;
