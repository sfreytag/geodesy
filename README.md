# Geodesy

Geodesy is a quick spatial search engine for the EPSG Geodetic Parameter Registry.

This app helps you to find useful EPSG entries around a particular location:

- Click the map
- Get a list of entries immediately
- Sort and filter using some pragmatic tools
- View their extents rightaway.
- Reproject the map (for some CRS only)
- Click through to epsg.io for more info

It works on phones, too.

Try it out at http://geodesy.onrender.com

## EPSG Entries

Click the 'About' tab on http://geodesy.onrender.com to find out which EPSG entries are
being searched, and which not.

## Code

The UI is a Vue.js application running on top of a JSON flat file database. This is built on demand (eg install and deploy) by Node scripts.

## Install

1. Install NPM if you haven't already
2. Clone this repo
3. Run `npm install`
4. Download the EPSG Registry. You need to create a directory `epsg` in the project root, and add these files to it: `EPSG_Polygons.dbf`, `EPSG_Polygons.shp`, `GmlDictionary.xml`
5. Download the WKT Zip archive and unzip it to `epsg/wkt`
6. Build the database from the EPSG data files. Run `npm run processData` and `npm run processGml`
7. You should now be able to do `npm run serve` and access a local version at http://localhost:8080

Other NPM scripts:

- Compiles and minify for production: `npm run build`
- Lints and fixes files: `npm run lint`
- Builds the database and runs the build job (useful for deploying): `npm run deploy`

## Deploy

This app can be deployed to anywhere that can host a static web app.

