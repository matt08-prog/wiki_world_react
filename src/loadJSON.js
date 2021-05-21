import { AppendJSON, archiveJSON } from "./appendJSON.js";
import * as d3 from "d3";

export function LoadJSON({ json, color, pack, diameter, zoomPos, first }) {
  //console.log("loading JSON", json);
  let First = first;
  let root = d3
    .hierarchy(json)
    .sum(function (d) {
      return d.size;
    })
    .sort(function (a, b) {
      return b.value - a.value;
    });

  let nodes = pack(root).descendants();

  //console.log(root);
  let lastZoom = {};
  let textPadding = 0.9;
  let interpEnd = 2.5;
  let zooming = false;
  let zoomInterp;
  let time;
  let firstNode = true;

  let svg = d3.select("svg"),
    margin = 60,
    g = d3.select("g");

  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();

  //console.log(root.data.name);

  let selectedNode = root;

  let focus = root,
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
      return `i${id.toString()}`;
    })
    .style("fill", function (d) {
      return d.children ? color(d.depth) : null;
    })
    .on("click", function (event, d) {
      if (focus !== d) {
        zoom(d);
        //console.log(d);
        selectedNode = d;
        let parameters = {
          oldJ: json,
          currentNode: selectedNode,
          color: color,
          pack: pack,
          diameter: diameter,
          nodes: nodes,
          doneZooming: doneZooming,
        };
        AppendJSON(parameters);
        event.stopPropagation();
      }
    });

  function doneZooming(newJSON) {
    //console.log("done zooming");
    let interval = setInterval(() => {
      ////// console.log(`interval, ${zooming}`, newJSON)
      //console.log(`${zooming}   and newJSON: `, newJSON);
      if (!zooming && newJSON) {
        clearInterval(interval);
        //console.log("loading new JSON: ", newJSON);
        let parameters = {
          json: { ...newJSON },
          color: color,
          pack: pack,
          diameter: diameter,
          zoomPos: [300.7142857678003, 300.7142834886682, 601.5285644274461],
        };
        //console.log(newJSON);
        archiveJSON({ ...parameters }, newJSON);
        LoadJSON(parameters);
        if (first) {
          first = false;
          let circs = document.querySelectorAll("circle");

          for (var i = 0; i < circs.length; i++) {
            circs[i].style.visibility = "visible";
          }
        }
      }
    }, 500);
  }

  // Mouse events
  d3.selectAll("circle")
    .filter((d) => {
      return d.height < 5;
    })
    .on("mouseover", (event, d) => {
      if (!zooming) {
        selectedNode = d;
      }

      d3.selectAll(`text#${event.target.id}:not(.circleName)`).attr(
        "visibility",
        "visible"
      );
      if (lastZoom) {
        textNode.attr("transform", function (d) {
          return (
            "translate(" +
            (d.x - lastZoom.v0) * lastZoom.k +
            "," +
            (d.y - lastZoom.v1 - selectedNode.r) * lastZoom.k +
            ")"
          );
        });
      }
    })
    .on("mouseout", (event, d) => {
      //console.log(`clickity clack stop on ${event.target.id}`);
      if (event.target.id != "i1") {
        d3.selectAll(`text#${event.target.id}`).attr("visibility", "hidden");
      }
    })
    .on("auxclick", (event, d) => {
      //console.log(d.data.name)
      let URL = d.data.name;
      window.open(`https://en.wikipedia.org/wiki/${URL}`, "_blank");
    });

  id = 0;

  let text = g
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("visibility", "hidden")
    .attr("id", function () {
      id++;
      return `i${id.toString()}`;
    })
    .style("fill-opacity", function (d) {
      //return d.parent === root ? 1 : 0;
      return 1;
    })
    .style("display", function (d) {
      //return d.parent === root ? "inline" : "none";
      return "inline";
    })
    .text(function (d) {
      if (firstNode) {
        firstNode = false;
        //this.visibility = "visible"
        //console.log(this.visibility)
        d3.select(this)
          .attr("visibility", "visible")
          .attr("class", "label circleName");
      }
      return d.data.name;
    });

  //  d3.selectAll(".circleName").attr("transform", function (d) {
  //    return "translate(" + -500 + "," + (-400) + ")";
  //  });

  let circleName = d3.select(".circleName").node();
  d3.select(".circleName")
    .attr("x", (d) => {
      let x = window.innerWidth * -0.5 + 10;
      //console.log(circleName.getBoundingClientRect());
      return x + circleName.getBoundingClientRect().width / 2;
    })
    .node();
  d3.selectAll(".circleName").attr("y", "-30%");

  let circleNode = g.selectAll("circle");
  let textNode = g.selectAll("text:not(.circleName)");

  svg.style("background", color(-1));

  const d = d3.selectAll("div").on("click", () => zoom(root));

  zoomTo([root.x, root.y, root.r * 2 + margin], root.r);

  function zoom(d) {
    let focus0 = focus;
    focus = d;

    let transition = d3
      .transition()
      .duration(Object.altKey ? 7500 : 1500)
      .tween("zoom", function (d) {
        zooming = true;

        zoomInterp = d3.interpolateZoom(view, [
          focus.x,
          focus.y,
          focus.r * 2 + margin,
        ]);

        if (textPadding == 0.9) {
          interpEnd = 2.5;
        } else {
          interpEnd = 0.9;
        }
        let textInterp = d3.interpolate(textPadding, interpEnd);
        return function (t) {
          time = t;
          zoomTo(zoomInterp(t), focus.r);
          textPadding = textInterp(t);
        };
      })
      .on("end", () => {
        //// console.log(zoomInterp(time))
        //// console.log("done zooming");
        zooming = false;
        First = false;

        ////// console.log(json.children[0].children);
      });
  }

  function zoomTo(v, radius) {
    //console.log(diameter)
    let k = diameter / v[2];
    view = v;
    circleNode.attr("transform", function (d) {
      //console.log((d.x - v[0]) * k);
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });

    textNode.attr("transform", function (d) {
      lastZoom = {
        x: d.x,
        y: d.y,
        v0: v[0],
        v1: v[1],
        k: k,
      };

      return (
        "translate(" +
        (d.x - v[0]) * k +
        "," +
        (d.y - v[1] - selectedNode.r) * k +
        ")"
      );
    });

    circle.attr("r", function (d) {
      return d.r * k;
    });
  }

  if (zoomPos) {
    //zoomTo(zoomPos);
  }

  if (first) {
    let circs = document.querySelectorAll("circle");

    for (var i = 0; i < circs.length; i++) {
      circs[i].style.visibility = "hidden";
    }
    //console.log("first");
    let parameters = {
      json: { ...json.children[0] },
      color: color,
      pack: pack,
      diameter: diameter,
      zoomPos: [300.7142857678003, 300.7142834886682, 601.5285644274461],
    };
    let jison = { ...json };
    //console.log(jison.children[0]);
    archiveJSON({ ...parameters }, jison.children[0]);

    //zoom(root);
    //console.log(root);
    selectedNode = root;
    parameters = {
      oldJ: json,
      currentNode: selectedNode,
      color: color,
      pack: pack,
      diameter: diameter,
      nodes: nodes,
      doneZooming: doneZooming,
      first: First,
    };
    AppendJSON(parameters);
  }
}
