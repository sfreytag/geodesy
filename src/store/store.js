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
        leftDeadSpace: 0,
        // A flag to tell all EpsgEntries to deselect themselves
        hideAll: false,
        // The sort order for the EPSG Entry
        sort: 'size',
        // Filters for the results
        filters: {
            deprecated: true
        }
    },

    getters: {
        filteredResults(state) {
            return state.results.filter((r) => {
                const deprecatedTest = state.filters.deprecated ? true : r.deprecated == false
                return deprecatedTest
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
        setLeftDeadSpace(state, n) {
            state.leftDeadSpace = n
        },
        setHideAll(state, b) {
            state.hideAll = b
        },
        setSort(state, s) {
            state.sort = s
        },
        setDeprecated(state, d) {
            state.filters.deprecated = d
        }
    },

    actions: {}
});
