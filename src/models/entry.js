/**
 * entry.js
 * Wraps an EPSG Registry Entry
 */
import {transformExtent} from "ol/proj"
import {getArea as getSphereArea} from 'ol/sphere'
import {fromExtent as polygonFromExtent} from 'ol/geom/Polygon.js'

export default class Entry {
    constructor(info, area) {
        this.code = info.code
        this.name = info.name
        this.type = info.type
        this.deprecated = info.deprecated
        this.unit = info.unit

        this.area = area

        this._size = null
        this._sizeMm2 = null
        this._extent = null
    }

    // Get the spherical area in m^2
    get size() {
        if (!this._size) this._size = getSphereArea(
            polygonFromExtent(this.extent)
        )
        return this._size
    }

    // Convert the spherical area to square megameters, 2dp
    get sizeMm2() {
        if (!this._sizeMm2) this._sizeMm2 = Math.round(
            this.size / Math.pow(10, 12) * 100
        ) / 100
        return this._sizeMm2
    }

    // Get an ol Extent for this entry
    get extent() {
        if (!this._extent) this._extent = transformExtent([
            this.area.minX,
            this.area.minY,
            this.area.maxX,
            this.area.maxY
        ], 'EPSG:4326', 'EPSG:3857')
        return this._extent
    }
}

