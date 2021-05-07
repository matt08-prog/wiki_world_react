import './App.css';
import {Eyes} from './eyes.js'
import {Face} from './face.js'
import {Mouth} from './mouth.js'
import {FaceContainer} from './faceContainer.js'
import {SmileyFace} from './smileyFace.js'




function App() {
  console.log(window.width)

  const fillStyle= {
    margin: 0,
    height: "100%",
    width: "100%"
  }

  let width = window.innerWidth,
      height = window.innerHeight

  return (
    <div className="App" >
        <SmileyFace fillStyle={fillStyle} width={width} height={height}/>
    </div>
  );
}

export default App;
