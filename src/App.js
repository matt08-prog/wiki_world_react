import * as d3 from 'd3'
import { useEffect } from 'react';
import './App.css';

function App() {
  console.log(window.innerWidth)

  const fillStyle= {
    margin: 0,
    height: "100%",
    width: "100%"
  }

  let width = 960,
      height = 960,
      diameter = width,
      maxDepth = 5,
      margin = 20

  var color = d3.scaleLinear()
      .domain([-1, maxDepth])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

  var pack = d3.pack()
      .size([diameter - margin, diameter - margin])
      .padding(2);
    
  useEffect(() => {
    var svg = d3.select("svg"),
        margin = 20,
        g = d3.select("g")

    console.log("loading JSON")  
    
    d3.json("./flare.json").then(function(root) {
      // if (error) throw error;
      console.log("loaded JSON")
    
      root = d3.hierarchy(root)
          .sum(function(d) { return d.size; })
          .sort(function(a, b) { return b.value - a.value; });
    
      var focus = root,
          nodes = pack(root).descendants(),
          view;
    
      var circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
          .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
          .style("fill", function(d) { return d.children ? color(d.depth) : null; })
          .on("click", function(event, d) { 
            console.log(focus); 
            console.log(d); 
            console.log(focus==d); 
            if (focus !== d) {
              zoom(d); 
              event.stopPropagation();
            }
          });
    
      var text = g.selectAll("text")
        .data(nodes)
        .enter().append("text")
          .attr("class", "label")
          .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
          .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
          .text(function(d) { return d.data.name; });
    
      var node = g.selectAll("circle,text");
    
      svg
          .style("background", color(-1))
    
      const d = d3.selectAll("div")
          .on("click", () => zoom(root))

      zoomTo([root.x, root.y, root.r * 2 + margin]);
    
      function zoom(d) {
        // console.log(d)
        var focus0 = focus; focus = d;
    
        var transition = d3.transition()
            .duration(Object.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
              var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
              return function(t) { zoomTo(i(t)); };
            });
    
        transition.selectAll("text")
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }
    
      function zoomTo(v) {
        //console.log(v)
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
      }
    })

    return () => undefined;
  }, []); 

  return (
    <div className="App" >
        <svg width={width} height={height}>
          <g transform={`translate(${diameter / 2},${diameter / 2})`}/>
        </svg>
    </div>
  );
}

export default App;
