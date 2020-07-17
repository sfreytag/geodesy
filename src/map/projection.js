/**
 * projection.js
 *
 * Deal with reprojecting the map into one of the projections found in a
 * search.
 */

import axios from 'axios'
import {View} from 'ol'
import {transform} from 'ol/proj'
import {register} from 'ol/proj/proj4'
import proj4 from 'proj4'
import {get as getProjection} from 'ol/proj'
import {getMap} from './interface.js'
import {store} from '@/store/store.js'

// Entry point for reprojecting the map into any EPSG code.
export function reproject(code) {
    if (code == '3857') {
        setProjection({code})
    }
    else {
        searchEpsg(code).then((results) => {
            let projResult = findValidProj(results)
            if (projResult)
                setProjection(projResult)
            else
                alert ("Cannot reproject to this... could not find a proj4 definition.")
        })
    }
}

// Get info about a projection from epsg.io
function searchEpsg(code) {
    let xDomain = axios.create()
    delete xDomain.defaults.headers.common['X-Requested-With']
    return xDomain.get(
        'https://epsg.io/?format=json&q=' + code
    ).then((response) => {
        return response.data.results
    })
}

// Check the results of an epsg.io query to see if a valid projection exists
// within the data.
function findValidProj(results) {
    if (results && results.length > 0) {
        let i, result
        for (i = 0; i < results.length; i++) {
            result = results[i];
            if (result) {
                if (result.code && result.code.length > 0
                    && result.proj4 && result.proj4.length > 0
                    && result.bbox && result.bbox.length == 4) {
                    return result;
                }
            }
        }
    }
    return false
}

// Once we have a valid projection, extract the proj4 def and reproject the
// map into it.
function setProjection(projResult) {
    const code = projResult['code']
    const newProjCode = 'EPSG:' + code;
    const proj4def = projResult['proj4']
    const currentProjCode = store.state.projection

    if (proj4def) {
        proj4.defs(newProjCode, proj4def);
        register(proj4);
    }
    let newProj = getProjection(newProjCode);

    let map = getMap()
    let center = map.getView().getCenter()
    map.once("postrender", () => {
        map.getView().setCenter(transform(center, currentProjCode, newProjCode))
        map.getView().setZoom(4)
        store.commit('setProjection', newProjCode)
    })
    map.setView(new View({
        projection: newProj,
        multiWorld: true
    }))
}
