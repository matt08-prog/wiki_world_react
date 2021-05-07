import * as d3 from 'd3'

export const Mouth = () => {

    let data = [{x: -320, y: 9.5}, {x: -215, y: 20},{x: 0, y: 300}, {x: 215, y: 20}, {x: 320, y: 9.5}]

    const mouthArc = d3.arc()
    .innerRadius(300)
    .outerRadius(325)
    .startAngle(Math.PI / 2)
    .endAngle(Math.PI+(Math.PI / 2))

    const curveFunc = d3.line()
    .curve(d3.curveBasis)
    .x((d) => {return d.x})
    .y((d) => {return d.y})    

    return (
        <>
        <path d={mouthArc()}></path>
        <path d={curveFunc(data)} fill="none" stroke="black" strokeWidth="20"></path>
        </>
    )
}