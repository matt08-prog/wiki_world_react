export const Data = (data, title) => {

  function deepFreeze(o) {
    Object.freeze(o);

    Object.getOwnPropertyNames(o).forEach(function (prop) {
      if (
        o.hasOwnProperty(prop) &&
        o[prop] !== null &&
        (typeof o[prop] === "object" || typeof o[prop] === "function") &&
        !Object.isFrozen(o[prop])
      ) {
        deepFreeze(o[prop]);
      }
    });

    return o;
  }

  let json = {};

  json["name"] = title;
  json["children"] = [];

  // let child = {}
  // child["name"] = title;
  // child["children"] = [];

  let cluster = {};
  cluster["name"] = title;
  cluster["children"] = [];
  let size
  
  data.forEach((it) => {
    if (
      it.title.indexOf(":") == -1) {
      size = Math.random() * 200 + 25;
      //console.log(size)
      cluster["children"].push({
        name: it.title,
        size: Math.random() * 200 + 25,
      });
    }
  });
  //console.log(cluster["children"]);
  let i = {
    name: title,
    children: [{}]
  }
  
  i.children[0].children = [...cluster["children"]]
  i.children[0].name = title
  
  //let p = {...i}
  // for(let nod in i.children[0].children) {
  //   Object.freeze(i.children[0].children[nod]);
  //   //console.log(nod)
  //   console.log(i.children[0].children[nod]);
  // }
  //deepFreeze(i);
  //Object.freeze(i);
  //console.log(i)

  //json["children"].push({...p});
  //console.log(json);
  // json["children"].push(child);
  return i;
};

/*
{
    "name": "flare",
    "children": [
        {
            "name": "analytics",
            "children": [
                {    
                    "name": "cluster",
                    "children": [
                    {"name": "AgglomerativeCluster", "size": 3938},
                    {"name": "CommunityStructure", "size": 3812},
                    {"name": "HierarchicalCluster", "size": 6714},
                    {"name": "MergeEdge", "size": 743}
                    ]
                }
            ]
        }

    ]
}
*/
