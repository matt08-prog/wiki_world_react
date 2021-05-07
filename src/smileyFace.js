import {Eyes} from './eyes.js'
import {Face} from './face.js'
import {Mouth} from './mouth.js'
import {FaceContainer} from './faceContainer.js'

export const SmileyFace = ({fillStyle, width, height}) => (
    <FaceContainer fillStyle={fillStyle} w={width} h={height}>
      <Face/>
      <Eyes/>
      <Mouth/>
    </FaceContainer>
  )