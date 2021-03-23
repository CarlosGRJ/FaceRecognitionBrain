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
      };
   }

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
      console.log('box ', box);
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
      this.setState({route: route});
   }

   render() {
      return (
         <div className='App'>
            <Particles params={particlesOptions} className='particles' />
            <Navigation onRouteChange={this.onRouteChange} />
            {this.state.route === 'signin' ? (
               <Signin onRouteChange={this.onRouteChange} />
            ) : (
               <>
                  <Logo />
                  <Rank />
                  <ImageLinkForm
                     onInputChange={this.onInputChange}
                     onButtonSubmit={this.onButtonSubmit}
                  />
                  <FaceRecognition
                     box={this.state.box}
                     imageUrl={this.state.imageUrl}
                  />
               </>
            )}
         </div>
      );
   }
}

export default App;
