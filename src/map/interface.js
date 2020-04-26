/**
 * map/interface.js is a module to hold non-reactive map state and data to be
 * shared between all Vue components.
 *
 * The goal is not to reinvent the wheel by creating an API on top of the OL API
 * so eg rather than implement a zoomIn method here ,it is better for the
 * consuming code to access the map and the OL API from there -
 *
 * ```
 * import {getMap} from 'map/interface.js'
 * let olMap = getMap() // Can use the OL API from here
 * olMap.getView().setZoom(4)
 * ```
 */

import {View} from 'ol'
import {transform} from 'ol/proj'

let map = null
let extentSource = null
let reticleLayer = null

function getMap() {
    return map
}

function setMap(m) {
    map = m
}

function getExtentSource() {
    return extentSource
}

function setExtentSource(s) {
    extentSource = s
}

function getReticleLayer() {
    return reticleLayer
}

function setReticleLayer(l) {
    reticleLayer = l
}

const origin = new View({
    center: transform(
        [0, 50], 'EPSG:4326', 'EPSG:3857'
    ),
    zoom: 4,
    projection: 'EPSG:3857',
    multiWorld: true
})

export {
    origin,
    getMap,
    setMap,
    getExtentSource,
    setExtentSource,
    getReticleLayer,
    setReticleLayer,
}