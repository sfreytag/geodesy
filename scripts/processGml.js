#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const parseXml = require("@rgrove/parse-xml")

// Execute the script in the project root.
process.chdir(path.normalize(__dirname + "/.."));

// The list of simplified gml entries created by this script.
let output = []

// Store a hash of area codes to output indexes
let areaIndex = {}

// Load the GML dictionary and parse it. parseXML returns a JS object of the
// entire doc rather than a stream, but it seems to work OK even on this
// large file.
let xmldata = fs.readFileSync("epsg/9.8.9/GmlDictionary.xml", {encoding: "UTF-8"})
let parsed = parseXml(xmldata)

// Extract the list of <gml:DictionaryEntry> tags.
let gmlDictionary = parsed.children[0]
let gmlEntries = gmlDictionary.children

// Each <gml:DictionaryEntry> has as its first child one of the following
// tags. Each one mapped to a handler function to process its contents. Some
// entries are not (yet) interesting, so these are mapped to a no-operation
// function.
let handlers = {
  'epsg:ExtentDefinition': handleNoop,
  'epsg:AxisName': handleNoop,
  'gml:Transformation': handleNoop,
  'gml:Conversion': handleNoop,
  'gml:ConcatenatedOperation': handleNoop,
  'gml:ProjectedCRS': handleProjectedCRS,
  'gml:GeodeticCRS': handleGeodeticCRS,
  'gml:VerticalCRS': handleNoop,
  'gml:CompoundCRS': handleNoop,
  'gml:EngineeringCRS': handleNoop,
  'gml:CartesianCS': handleNoop,
  'gml:VerticalCS': handleNoop,
  'gml:EllipsoidalCS': handleNoop,
  'gml:SphericalCS': handleNoop,
  'gml:GeodeticDatum': handleNoop,
  'gml:VerticalDatum': handleNoop,
  'gml:EngineeringDatum': handleNoop,
  'epsg:Deprecation': handleNoop,
  'gml:Ellipsoid': handleNoop,
  'gml:PrimeMeridian': handleNoop,
  'gml:OperationMethod': handleNoop,
  'epsg:NamingSystem': handleNoop,
  'gml:OperationParameter': handleNoop,
  'epsg:Supersession': handleNoop,
  'gml:ConventionalUnit': handleNoop,
  'gml:BaseUnit': handleNoop,
  'epsg:VersionHistory': handleNoop,
  'epsg:ChangeRequest': handleNoop,
}

// Iterate through the list of dictionary entries and call the handler for each
// one.
let i = 0
for (let i = 0; i < gmlEntries.length; i++) {
  let gmlEntry = gmlEntries[i]
  if (gmlEntry.type == "element" && gmlEntry.name == "gml:dictionaryEntry") {
    let entryType = gmlEntry.children[0].name
    if (typeof handlers[entryType] == "function") {
      let entry = handlers[entryType](gmlEntry.children[0])
      if (entry) {
        output.push(entry)
        if (typeof areaIndex[entry.area] == "undefined") {
          areaIndex[entry.area] = []
        }
        areaIndex[entry.area].push({
          name: entry.name,
          code: entry.code,
          type: entry.type,
          deprecated: entry.deprecated
        })
      }
    }
  }
}

// Write the data to disk.
fs.mkdirSync('public/data/out', {recursive: true})
const outputData = JSON.stringify(output)
fs.writeFileSync("public/data/out/epsg_dictionary.json", outputData)
const areaIndexData = JSON.stringify(areaIndex)
fs.writeFileSync("public/data/out/area_index.json", areaIndexData)

/**
 * handleNoop is a 'no operation' handler for the GML entries we don't (yet)
 * care about.
 */
function handleNoop() {
  return false;
}

/**
 * handleProjectedCRS extracts information about projected coordinate reference
 * systems, such as EPSG:27700 the GB national grid.
 */
function handleProjectedCRS(projectedCRS) {
  let entry = makeTemplate()
  projectedCRS.children.forEach(function(child) {
    if (child.name == "gml:name")
      entry.name = child.children[0].text
    else if (child.name == "gml:identifier")
      entry.code = child.children[0].text.split(":").pop()
    else if (child.name == "gml:domainOfValidity")
      entry.area = child.attributes['xlink:href'].split(":").pop()
    else if (child.name == "gml:metaDataProperty") {
      const cmd = getChildByName(child, "epsg:CommonMetaData")
      const isD = getChildByName(cmd, "epsg:isDeprecated")
       entry.deprecated = isD.children[0].text === "true"
    }
  })
  entry.type = "ProjectedCRS"
  return entry
}

/**
 * handleGeodeticCRS
 */
function handleGeodeticCRS(geodeticCRS) {
  let entry = makeTemplate()
  geodeticCRS.children.forEach(function(child) {
    if (child.name == "gml:name")
      entry.name = child.children[0].text
    else if (child.name == "gml:identifier")
      entry.code = child.children[0].text.split(":").pop()
    else if (child.name == "gml:domainOfValidity")
      entry.area = child.attributes['xlink:href'].split(":").pop()
    else if (child.name == "gml:metaDataProperty") {
      entry.deprecated = false
      // There are two types of metadata inside gml:metaDataProperty
      const cmd = getChildByName(child, "epsg:CommonMetaData")
      const crs = getChildByName(child, "epsg:CRSMetaData")
      // Only process the CommonMetaData for now
      if (cmd) {
        const isD = getChildByName(cmd, "epsg:isDeprecated")
        entry.deprecated = isD.children[0].text === "true"
      }
    }
  })
  entry.type="GeodeticCRS"
  return entry
}

/**
 * makeTemplate returns a template for the data we want to store for each GML
 * dictionary entry.
 */
function makeTemplate() {
  return {name: '', code: '', area: '', type: '', deprecated: ''}
}

/**
 * getChildByName
 */
function getChildByName(node, name) {
  if (!(node && node.children)) return false
  let i
  for (i = 0; i < node.children.length; i++) {
    if (node.children[i].name == name) return node.children[i]
  }
  return false
}