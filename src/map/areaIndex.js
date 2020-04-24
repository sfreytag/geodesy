/**
 * map/db.js
 * Wraps the JSON area index database produced by the EPSG Registry Flattener
 *
 * The area index is a hash of EPSG area codes to EPSG Dictionary Entries
 *
 * EG the British National Grid (27700) uses area 4390 so the has looks like
 * {4390: {name: 'OSGB ...', code: 27700, type: 'ProjectedCRS'}}
 */

import axios from 'axios'

let areaIndex = null;

function loadAreaIndex() {
    return axios.get(
        '/data/out/area_index.json'
    ).then((response) => {
        if (response.data) {
            areaIndex = response.data;
            return areaIndex
        }
        return false
    }).catch(() => {})
}

function getAreaIndex() {
    return new Promise((resolve) => {
        if (areaIndex) resolve(areaIndex)
        else return loadAreaIndex()
    })
}

export {
    loadAreaIndex,
    getAreaIndex
}