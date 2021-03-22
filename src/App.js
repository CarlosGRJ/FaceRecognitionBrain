import React from 'react';
import Particles from 'react-particles-js';
import './App.css';
import { ImageLinkForm } from './components/ImageLinkForm/ImageLinkForm';
import { Logo } from './components/Logo/Logo';
import { Navigation } from './components/Navigation/Navigation';
import { Rank } from './components/Rank/Rank';

const particlesOptions = {
  particles: {
    // shape: {
    //   type: 'images',
    //   image: [
    //     { src: 'path/to/first/image.svg', height: 20, width: 20 },
    //     { src: 'path/to/second/image.jpg', height: 20, width: 20 },
    //   ],
    // },
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 800
      }
    },
  },
};

function App() {
  return (
    <div className='App'>
      <Particles params={particlesOptions} className='particles' />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/*
      <FaceRecognition /> */}
    </div>
  );
}

export default App;
