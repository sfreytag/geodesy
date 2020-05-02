/**
 * store.js is a VueX store, currently holding all reactuve UI state (ie, no
 * modules). There is some UI state for the map that does not need to be
 * reactive. This is stored in src/map/interface.js
 */

import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store =  new Vuex.Store({
    state: {
        // The list of results from a spatial search
        results: [],
        // The dead space occupied by the slider tray on the left
        sliderSpace: 0,
        // A flag to tell all EpsgEntries to deselect themselves
        hideAll: false,
        // The sort order for the EPSG Entry
        sort: 'size',
        // Filters for the results
        filters: {
            deprecated: false,
            typeProjectedCrs: true,
            typeGeodeticCrs: true,
            typeVerticalCrs: true,
            typeCompoundCrs: true,
            unitMetre: true,
            unitFoot: true,
            unitDegree: true,
            unitUnknown: true,
            areaMin: 0,
            areaMax: 550,
            includeWgs: true,
            includeUtm: true,
        },
        // The map projection code
        projection: 'EPSG:3857'
    },

    getters: {
        filteredResults(state) {
            return state.results.filter((r) => {
                const f = state.filters
                if (!f.deprecated && r.deprecated) return false
                if (!f.typeProjectedCrs && r.type == "ProjectedCRS") return false
                if (!f.typeGeodeticCrs && r.type == "GeodeticCRS") return false
                if (!f.typeVerticalCrs && r.type == "VerticalCRS") return false
                if (!f.typeCompoundCrs && r.type == "CompoundCRS") return false
                if (!f.unitMetre && r.unit.indexOf("metre") != -1) return false
                if (!f.unitFoot && r.unit.indexOf("foot") != -1) return false
                if (!f.unitDegree && r.unit.indexOf("degree") != -1) return false
                if (!f.unitUnknown && r.unit.indexOf("unknown") != -1) return false
                if (r.sizeMm2 < f.areaMin) return false
                if (r.sizeMm2 > f.areaMax) return false
                if (!f.includeWgs && r.name.indexOf("WGS") != -1) return false
                if (!f.includeUtm && r.name.indexOf("UTM") != -1) return false
                return true
            })
        },
        sortedResults(state, getters) {
            return getters.filteredResults.sort(function(l, r) {
                if (state.sort == "size")
                    return l.size - r.size
                else if (state.sort == "code")
                    return parseInt(l.code) - parseInt(r.code)
                else if (state.sort == "name")
                    return (l.name < r.name) ? -1 : 1
            })
        },
    },

    mutations: {
        clearResults(state) {
            state.results = []
        },
        setResults(state, results) {
            state.results = results
        },
        setSliderSpace(state, n) {
            state.sliderSpace = n
        },
        setHideAll(state, b) {
            state.hideAll = b
        },
        setSort(state, s) {
            state.sort = s
        },
        setDeprecated(state, d) {
            state.filters.deprecated = d
        },
        setTypeProjectedCrs(state, p) {
            state.filters.typeProjectedCrs = p
        },
        setTypeGeodeticCrs(state, g) {
            state.filters.typeGeodeticCrs = g
        },
        setTypeVerticalCrs(state, v) {
            state.filters.typeVerticalCrs = v
        },
        setTypeCompoundCrs(state, c) {
            state.filters.typeCompoundCrs = c
        },
        setProjection(state, p) {
            state.projection = p
        },
        setUnitFoot(state, u) {
            state.filters.unitFoot = u
        },
        setUnitMetre(state, u) {
            state.filters.unitMetre = u
        },
        setUnitDegree(state, u) {
            state.filters.unitDegree = u
        },
        setUnitUnknown(state, u) {
            state.filters.unitUnknown = u
        },
        setAreaMin(state, n) {
            console.log('setAreaMin', n)
            state.filters.areaMin = n
        },
        setAreaMax(state, n) {
            console.log('setAreaMax', n)
            state.filters.areaMax = n
        },
        setIncludeWgs(state, b) {
            console.log('setIncludeWgs', b)
            state.filters.includeWgs = b
        },
        setIncludeUtm(state, b) {
            state.filters.includeUtm = b
        }
    },

    actions: {}
});
