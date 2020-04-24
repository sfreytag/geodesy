/**
 * map/interface.js is a module to hold non-reactive map state and common map
 * functions to be shared between all Vue components.
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

export {
    getMap,
    setMap,
    getExtentSource,
    setExtentSource,
    getReticleLayer,
    setReticleLayer
}