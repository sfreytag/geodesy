#!/usr/bin/env node

// This script parses the EPGS area shapefiles into static data usable for a
// JavaScript browser app to do fast spatial queries on that data.

// NOTE: Written/tested in MacOS. Possible cross-env issues.

const fs = require("fs")
const path = require("path")
const shapefile = require("shapefile")
const RBush = require("rbush")
const turf = require("@turf/turf")

// Execute the script in the project root.
process.chdir(path.normalize(__dirname + "/.."))

// Prep the directories needed for output files
fs.mkdirSync('public/data/out/shapes', {recursive: true})

// Build an RBush tree, which will be the spatial index into the area shapes. To
// keep the serialised tree small, it stores just the BBox of each shape and the
// area code as a key back to the original shape. Discarding the coords is what
// saves the space.
//
// GeoJSON of all shapes = ~150MB
// JSON file of this minimal index = ~350KB
function makeTreeItem(shape) {
  if (shape.type === 'Feature')
    bbox = turf.bbox(shape)
  else
    console.log("Unknown type:", feature)
  return {
    minX: bbox[0],
    minY: bbox[1],
    maxX: bbox[2],
    maxY: bbox[3],
    code: shape.properties.AREA_CODE,
    name: shape.properties.AREA_NAME
  }
}
let tree = new RBush(9)

// The in-memory shapefile, containing a list of records in GeoJSON format.
let source

// A counter, for the console output.
let count = 1

// A store for the tree items. Then they can be bulk-inserted into the tree.
// This results in faster insertion time and also faster search time.
let treeItems = []

// Open the shapefile and the data file and load them into the source. Kick off
// the recursive parsing.
console.log("Opening data...")
shapefile.open(
  "epsg/9.8.9/EPSG_Polygons.shp", "epsg/9.8.9/EPSG_Polygons.dbf"
).then(function(s) {
  console.log("Parsing data...")
  source = s
  source.read().then(handleRecord)
}).catch(function(error) {
  console.error(error.stack)
})

// Handle a recursion step.
//
//The source is processed recursively using `source.read`, which returns a
// promise to the next record. Each record is in the form {done, value}. If done
// is false, value holds the shape in GeoJSON. If done is true, then there are
// no more records.
function handleRecord(record) {
  if (record.done) {
    return finish()
  }
  processShape(record.value)
  return source.read().then(handleRecord)
}

// Process a shape by adding it to the list of tree items and writing out an
// individuual GeoJSON file.
function processShape(shape) {
  fs.writeFileSync(
    "public/data/out/shapes/area-" + shape.properties.AREA_CODE + ".json",
    JSON.stringify(shape)
  )
  treeItems.push(makeTreeItem(shape))
  count++
}

// When done:
// - build and serialise the spatial index
function finish() {
  console.log("Building RBush tree...")
  tree.load(treeItems)

  console.log("Writing tree to file...")
  const treeData = JSON.stringify(tree.toJSON())
  fs.writeFileSync("public/data/out/epsg_areas_rbush_tree.json", treeData)

  console.log("All done! " + count + " shapes parsed.")
}
