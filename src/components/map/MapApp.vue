<!--
MapApp
Parent component for the mapping app. Manages user interaction from the OL
map via the map wrapper. 
-->

<template>
    <div class="map-wrapper-container">
        <map-wrapper @map-singleclick="onMapSingleclick"/>
        <div class="projectionControl p-2 bg-white align-items-center d-none d-sm-flex">
            <span class="text-sm d-none d-md-inline mr-1">Current projection:</span>
            <span class="text-sm mr-2">{{projection}}</span>
            <button class="btn btn-primary btn-sm"
                v-on:click="resetProjection"
                v-if="projection != 'EPSG:3857'">
                Reset to EPSG:3857
            </button>
        </div>
        <results @clear-search="clearSearch"/>
    </div>
</template>

<style lang="scss" scoped>
    .map-wrapper-container {
        width: 100%;
        height: 100%;
    }
    .projectionControl {
        position: absolute;
        right: 0px;
        top: 0;
        height: 44px;
        border-top: 5px solid var(--info);
    }
</style>

<script>
    import MapWrapper from "../map/MapWrapper.vue"
    import Results from "../map/Results.vue"
    import {mapMutations, mapState} from "vuex"
    import {loadTree, getTree} from "../../map/tree.js"
    import {loadAreaIndex, getAreaIndex} from "../../map/areaIndex.js"
    import {getReticleLayer, getExtentSource} from "../../map/interface.js"
    import {transform} from "ol/proj"
    import knn from "rbush-knn"
    import Point from "ol/geom/Point"
    import Entry from "@/models/entry.js"
    import {reproject} from '@/map/projection.js'
    import axios from 'axios'

    // Export the component.
    export default {
        components: {
            'map-wrapper': MapWrapper,
            'results': Results
        },
        computed: {
            ...mapState(['projection'])
        },
        watch: {
            projection(to, from) {
                getReticleLayer()
                    .getSource()
                    .getFeatureById('reticle')
                    .getGeometry()
                    .transform(from, to)
            }
        },
        methods: {
            clearSearch() {
                this.clearResults()
                const rl = getReticleLayer()
                rl.setVisible(false)
                getExtentSource().clear()
            },
            onMapSingleclick(event) {
                this.clearSearch()
                this.updateReticle(event.coordinate)
                this.ping(event.coordinate)

                Promise.all([getTree(), getAreaIndex()]).then((data) => {
                    const tree = data[0]
                    const index = data[1]

                    // Search for areas nearest the mouse click
                    const coord = transform(
                        event.coordinate, 'EPSG:3857', 'EPSG:4326'
                    )
                    const areas = knn(tree, coord[0], coord[1], Infinity, () => {
                        return true
                    }, 0.001)

                    // Extract any EPSG entries using these areas.
                    let results = []
                    areas.forEach(function(area) {
                        let entries = index[area.code]
                        if (entries) {
                            entries.forEach(function(entry) {
                                results.push(new Entry(entry, area))
                            })
                        }
                    })
                    this.setResults(results)
                })
            },
            resetProjection() {
                reproject('3857')
            },
            updateReticle(coord) {
                const rl = getReticleLayer()
                rl.setVisible(true)
                rl.getSource().getFeatureById('reticle').setGeometry(
                    new Point(coord)
                )
            },
            ping(coord) {
                if (process.env.NODE_ENV != "production") return
                coord = transform(coord, 'EPSG:3857', 'EPSG:4326')
                const c = coord[1] + "," + coord[0]
                axios.get('/ping?c=' + c)
            },
            ...mapMutations(['clearResults', 'setResults'])
        },
        created() {
            loadTree()
            loadAreaIndex()
        }
    }
</script>