import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import { ImageLinkForm } from './components/ImageLinkForm/ImageLinkForm';
import { Logo } from './components/Logo/Logo';
import { Navigation } from './components/Navigation/Navigation';
import { Rank } from './components/Rank/Rank';
import { FaceRecognition } from './components/FaceRecognition/FaceRecognition';
import { Signin } from './components/Singin/Signin';
import { Register } from './components/Register/Register';

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
            value_area: 800,
         },
      },
   },
};

const app = new Clarifai.App({
   apiKey: '77ed032b811443969d2e58bf5c33d7ee',
});

class App extends Component {
   constructor() {
      super();
      this.state = {
         input: '',
         imageUrl: '',
         box: {},
         route: 'signin',
         isSignedIn: false,
         user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: '',
         },
      };
   }

   loadUser = (data) => {
      this.setState({
         user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined,
         },
      });
   };

   calculateFaceLocation = (data) => {
      const clarifaiFace =
         data.outputs[0].data.regions[0].region_info.bounding_box;
      console.log('clarifaiFace ', clarifaiFace);

      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);

      return {
         leftCol: clarifaiFace.left_col * width,
         topRow: clarifaiFace.top_row * height,
         rightCol: width - clarifaiFace.right_col * width,
         bottomRow: height - clarifaiFace.bottom_row * height,
      };
   };

   displayFaceBox = (box) => {
      this.setState({ box: box });
   };

   onInputChange = (event) => {
      this.setState({ input: event.target.value });
   };

   onButtonSubmit = () => {
      this.setState({ imageUrl: this.state.input });
      app.models
         .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
         .then((response) =>
            this.displayFaceBox(this.calculateFaceLocation(response)),
         )
         .catch((err) => console.log(err));
   };

   onRouteChange = (route) => {
      if (route === 'signout') {
         this.setState({ isSignedIn: false });
      } else if (route === 'home') {
         this.setState({ isSignedIn: true });
      }

      this.setState({ route: route });
   };

   render() {
      const { isSignedIn, imageUrl, route, box } = this.state;
      return (
         <div className='App'>
            <Particles params={particlesOptions} className='particles' />
            <Navigation
               isSignedIn={isSignedIn}
               onRouteChange={this.onRouteChange}
            />
            {route === 'home' ? (
               <>
                  <Logo />
                  <Rank />
                  <ImageLinkForm
                     onInputChange={this.onInputChange}
                     onButtonSubmit={this.onButtonSubmit}
                  />
                  <FaceRecognition box={box} imageUrl={imageUrl} />
               </>
            ) : route === 'signin' ? (
               <Signin onRouteChange={this.onRouteChange} />
            ) : (
               <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )}
         </div>
      );
   }
}

export default App;
