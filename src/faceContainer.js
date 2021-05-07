export const FaceContainer = ({children, fillStyle, w, h}) => (
    <svg style={fillStyle}>
      <g transform={`translate(${w/2},${h/2})`}>
        {children}
      </g>
    </svg>
)