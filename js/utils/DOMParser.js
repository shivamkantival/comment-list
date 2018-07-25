export function getDOMNodesFromString(stringifiedNodes) {
  return new DOMParser().parseFromString(
    stringifiedNodes,
    'text/html'
  ).body.childNodes.item(0);
}

export function findNodeWihClassname(parentNode, classname) {
  return parentNode.getElementsByClassName(classname).item(0);
}

export function findNodeWithTagName(parentNode, tagname) {
  return parentNode.getElementsByTagName(tagname).item(0);
}

export default {
  getDOMNodesFromString,
  findNodeWihClassname,
  findNodeWithTagName,
};
