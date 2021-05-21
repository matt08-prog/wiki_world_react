import * as d3 from "d3";
import { useEffect } from "react";
import { Pack, Backup } from "./pack.js";
import React from "react";

import "./App.css";

let id;

function App() {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  let diameter = window.innerWidth / 2.1,
    maxDepth = 5,
    margin = 20,
    color = d3
      .scaleLinear()
      .domain([-1, maxDepth])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl),
    pack = d3
      .pack()
      .size([diameter - margin, diameter - margin])
      .padding(2),
    title = "mario",
    UIOpen = true,
    p,
    i = 0;

  document.body.onmousedown = function (e) {
    if (e.button == 1) {
      e.preventDefault();
      return false;
    }
  };

  function beginApp(articleTitle, URITitle) {
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=links&meta=&titles=${URITitle}&pllimit=300&redirects`
    )
      .then((resp) => resp.json())
      .then((data) => {
        //console.log(URITitle)
        for (var key in data.query.pages) {
          //console.log(key)
          if (key != "-1") {
            p = new Pack(
              pack,
              color,
              diameter,
              data.query.pages[key].links,
              articleTitle
            );
          }
        }
      });
  }

  useEffect(() => {
    let URIName = encodeRFC5987ValueChars2(title);
    beginApp(title, URIName);
    return () => undefined;
  }, []);

  window.addEventListener("resize", () => {
    //console.log("resize")
    clearTimeout(id);
    id = setTimeout(doneResizing, 500);
  });

  function doneResizing() {
    //console.log("resize");
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  const changeArrowImage = (event) => {
    event.target.src = "./back_arrow_red.png";
  };

  const clearArrowImage = (event) => {
    event.target.src = "./back_arrow_clear.png";
  };

  function arrowClicked(event) {
    //console.log("clicked");
    //event.stopPropagation();
    let b = new Backup();
  }

  const changeCloseImage = (event) => {
    event.target.src = "./close_red.png";
  };

  const clearCloseImage = (event) => {
    event.target.src = "./close_clear.png";
  };

  function closeClicked(event) {
    let imgs = document.querySelectorAll(".UI");

    for (var i = 0; i < imgs.length; i++) {
      imgs[i].style.visibility = "hidden";
    }

    let bg = document.querySelectorAll(".background");

    for (var i = 0; i < bg.length; i++) {
      bg[i].style.visibility = "visible";
    }
    UIOpen = false;
  }
  useEffect(() => {
    let id = setInterval(() => {
      if (UIOpen && i < 5) {
        i++;
        arrowClicked();
        //console.log("backup");
      } else {
        //console.log("UUUUUUUUUUUUUUUUUUUUUUI closed");
        clearInterval(id);
      }
    }, 500);
  });

  function submitTitle(e) {
    e.preventDefault();
    let origName = document.querySelector("input").value;
    let name = encodeRFC5987ValueChars2(origName);
    // let search = " ";
    // let replaceWith = "_";
    // name = name.split(search).join(replaceWith);
    // search = "'";
    // replaceWith = "%27";
    // name = name.split(search).join(replaceWith);

    console.log([name, origName])
    beginApp(origName, name);
  }

  function encodeRFC5987ValueChars2(str) {
    return (
      encodeURIComponent(str)
        // Note that although RFC3986 reserves "!", RFC5987 does not,
        // so we do not need to escape it
        .replace(/['()*]/g, (c) => "%" + c.charCodeAt(0).toString(16)) // i.e., %27 %28 %29 %2a (Note that valid encoding of "*" is %2A
        // which necessitates calling toUpperCase() to properly encode)
        // The following are not required for percent-encoding per RFC5987,
        // so we can allow for a little better readability over the wire: |`^
        .replace(/%(7C|60|5E)/g, (str, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        )
    );
  }

  return (
    <div className="App">
      <img
        src="./back_arrow_clear.png"
        onMouseOver={changeArrowImage}
        onMouseLeave={clearArrowImage}
        onClick={arrowClicked}
        className="background"
      />
      <img
        src="./mouse1.png"
        style={{ left: "45%", top: "30%" }}
        className="UI"
      />
      <h1
        style={{
          textAlign: "center",
          position: "absolute",
          left: "27%",
          top: "50%",
          fontSize: "50px",
        }}
        className="UI label"
      >
        Middle click to open an article in a new tab.
      </h1>
      <h1
        style={{
          textAlign: "center",
          position: "absolute",
          left: "24%",
          top: "65%",
          fontSize: "50px",
        }}
        className="UI label"
      >
        Press the back icon to enter the previous article.
      </h1>
      <img
        src="./close_clear.png"
        style={{ left: "92%", top: "1%", width: "4%" }}
        onMouseOver={changeCloseImage}
        onMouseLeave={clearCloseImage}
        onClick={closeClicked}
        className="UI"
      />
      <form onSubmit={submitTitle} className="background">
        <label for="fname">Search for an article to begin your journey</label>
        <br />
        <input type="text" id="fname" name="fname" defaultValue={title} />
      </form>
      <svg width={dimensions.width} height={dimensions.height}>
        <g
          className="background"
          transform={`translate(${dimensions.width / 2},${
            dimensions.height / 2
          })`}
        />
        <rect
          width="100%"
          height="100%"
          className="UI"
          // fill="rgb(163,245,207)"
          fill="rgb(163,245,207)"
        />
        <rect
          x="10%"
          y="10%"
          width="80%"
          height="80%"
          rx="15"
          style={{
            fill: "rgb(245, 245, 245)",
            stroke: "rgb(0,0,0)",
            strokeWidth: "2%",
          }}
          className="UI"
        />
      </svg>
    </div>
  );
}

export default App;
