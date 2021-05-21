import * as d3 from "d3";
import { Data } from "./data.js";

export function Pack(pack, color, diameter, data, title) {
  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this);
    });
  };

  let root = Data(data, title);
  console.log(root);

  console.log("pack");

  let svg = d3.select("svg"),
    margin = 20,
    g = d3.select("g");

  console.log("loading JSON");
  console.log("loaded JSON");
  console.log(root);
  root = d3
    .hierarchy(root)
    .sum(function (d) {
      return d.size;
    })
    .sort(function (a, b) {
      return b.value - a.value;
    });

  let focus = root,
    nodes = pack(root).descendants(),
    view;

  let id = 0;

  let circle = g
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return d.parent
        ? d.children
          ? "node"
          : "node node--leaf"
        : "node node--root";
    })
    .attr("id", function () {
      id++;
      return id.toString();
    })
    .style("fill", function (d) {
      return d.children ? color(d.depth) : null;
    })
    .on("click", function (event, d) {
      if (focus !== d) {
        zoom(d);
        event.stopPropagation();
        console.log(d.data.name);
      }
    })


    // .each((d) => {
    //   console.log(d);
    // });








  d3.selectAll("circle")
  .filter((d) => { return d.height == 0})
  .each((d) => {
    console.log(d);
  }).on("mouseover", (event, d) =>{
    console.log("clickity clack")
  })












  id = 0;

  let text = g
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("id", function () {
      id++;
      return id.toString();
    })
    .style("fill-opacity", function (d) {
      return d.parent === root ? 1 : 0;
    })
    .style("display", function (d) {
      return d.parent === root ? "inline" : "none";
    })
    .text(function (d) {
      return d.data.name;
    });

  let node = g.selectAll("circle,text");

  svg.style("background", color(-1));

  const d = d3.selectAll("div").on("click", () => zoom(root));

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    let focus0 = focus;
    focus = d;

    let transition = d3
      .transition()
      .duration(Object.altKey ? 7500 : 750)
      .tween("zoom", function (d) {
        var i = d3.interpolateZoom(view, [
          focus.x,
          focus.y,
          focus.r * 2 + margin,
        ]);
        return function (t) {
          zoomTo(i(t));
        };
      });

    transition
      .selectAll("text")
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function (d) {
        return d.parent === focus ? 1 : 0;
      })
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  function zoomTo(v) {
    let k = diameter / v[2];
    view = v;
    node.attr("transform", function (d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function (d) {
      return d.r * k;
    });
  }

  console.log(d3.selectAll("circle"));
}
