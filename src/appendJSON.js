import { LoadJSON } from "./loadJSON.js";
import * as d3 from "d3";

let JSONHistory = [];
const root = {};
let index = 0;
let first = true;

export const AppendJSON = ({
  oldJ,
  currentNode,
  color,
  pack,
  diameter,
  nodes,
  doneZooming,
  backup,
  first,
}) => {
  let First;
  if (first == undefined) {
    First = false;
  }
  //console.log(oldJ);
  let oldJSON = { ...oldJ };
  let newJSON = oldJSON;
  let title;
  if (currentNode) {
    title = currentNode.data.name;
  }
  let name;
  let size;
  let newData;
  let json;

  let getWikiData = (articleTitle) => {
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=links&meta=&titles=${articleTitle}&pllimit=300&redirects&origin=*`
    )
      .then((resp) => resp.json())
      .then((data) => {
        let d = filterWikiData(data);
        if (d) {
          if (d.length == 1) {
            title = data[0];
            getWikiData(title);
          } else {
            implementWikiData(data);
          }
        }
      });
  };
  if (JSONHistory.length > 1 && backup == true && First == false) {
    //console.log("backing back up branch");
    let jH = [...JSONHistory];
    //console.log("jh: ", jH);
    if (jH.length == 2) {
      //console.log("first");
      first = false;
      //console.log(JSONHistory[JSONHistory.length - 2]);
      //JSONHistory[JSONHistory.length - 2].json.children = {}
      json = JSONHistory[JSONHistory.length - 2];
      for (let node in json.json.children) {
        if (json.json.children[node].children) {
          //console.log(json.json.children[node]);
          delete json.json.children[node].children;
        }
      }
      //console.log(json);
    } else {
      json = JSONHistory[JSONHistory.length - 2];
      //console.log(json.json);
      //console.log(JSONHistory[JSONHistory.length - 2].json);
    }
    let parameters = {
      json: json.json,
      color: JSONHistory[JSONHistory.length - 2].color,
      pack: JSONHistory[JSONHistory.length - 2].pack,
      diameter: JSONHistory[JSONHistory.length - 2].diameter,
      zoomPos: JSONHistory[JSONHistory.length - 2].zoomPos,
    };
    //console.log(parameters);
    LoadJSON(parameters);
    JSONHistory.splice(JSONHistory.length - 1, 1);

    //console.log("JSONHistory: ", JSONHistory);
  } else if (!backup) {
    getWikiData(title);
  }

  let filterWikiData = (data) => {
    for (var key in data.query.pages) {
      if (key != "-1") {
        newData = [];
        for (let page in data.query.pages[key].links) {
          size = 200 * Math.random() + 25;
          name = data.query.pages[key].links[page].title;
          if (name.indexOf(":") == -1) {
            newData.push({
              name: name,
              size: size,
            });
          }
        }
      }
    }
    return newData;
  };

  let implementWikiData = (data) => {
    name = currentNode.data.name;
    let query = newJSON;
    let i = 0;

    while (i <= currentNode.depth) {
      i++;
      if (query.children) {
        query = query.children;
      } else if (i <= 2) {
        query = query[0];
      }
    }

    for (let node in query) {
      if (query[node].name == name) {
        query[node]["children"] = newData;
        break;
      }
    }
    newJSON.name = name;
    newJSON.children = newData;

    doneZooming(newJSON);
  };
};

export function archiveJSON(parameters, nooooooooooj) {
  if (index == 0) {
    index++;
    const nj = { ...nooooooooooj };
    const njc = [...nooooooooooj.children];
    //console.log(njc);
    root.name = nj.name;
    root.children = njc;
    Object.freeze(root);
  }
  let params = { ...parameters };
  let noJ = { ...nooooooooooj };

  params.json = noJ;
  let p = { ...params };
  JSONHistory.push(parameters);
  JSONHistory[0].json = root;
  //console.log(`JSONHistory with push: ${index}`, JSONHistory);
}
