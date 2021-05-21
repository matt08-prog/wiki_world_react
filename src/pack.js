import { Data } from "./data.js";
import { LoadJSON } from "./loadJSON.js";
import * as d3 from "d3";
import { AppendJSON } from "./appendJSON.js";

export function Pack(pack, color, diameter, data, title) {
  let json = Data(data, title);

  //console.log(json);
  let parameters = {
    json: json,
    color: color,
    pack: pack,
    diameter: diameter,
    first: true,
  };
  new LoadJSON(parameters);
}

export function Backup() {
  //let json;
  //json = Data(data, title);
  //console.log(json);
  //console.log("backup");
  let parameters = {
    backup: true
  }

  AppendJSON(parameters);
}

