<!--
EpsgEntry
Represents an EPSG Registry entry. Each entry has an associated ESPG area
defining its domain of validty. The area has a BBox extent for quick use, but a
detailed GeoJSON polygon is loaded from a file. It can be toggled on and off. If
on, it is highlighted in the UI and the extent and detailed area are drawn on
the map.
-->
<template>
    <div v-on:click="handleClick"
        :style="{borderColor: borderColor}"
        class="entry"
        :class="{'text-muted': entry.deprecated === true}">
        <div class="d-flex justify-content-between align-items-top">
            <div class="inner">
                <b>
                    {{entry.name}}
                </b>
                <br />
                <span class="text-info">
                    EPSG:{{entry.code}}
                </span>
                <i>
                    {{entry.type}}
                </i>
                <tt v-if="this.sort == 'size'">
                    {{entry.sizeMm2}}Mm<sup>2</sup>
                </tt>
            </div>
            <div>
                <div class="btn btn-primary rounded-circle btn-deselect d-flex justify-content-center align-items-center"
                    v-if="active"
                    v-on:click.stop="deselectEntry">
                    <b-icon-x />
                </div>
            </div>
        </div>
        <div>
            <div class="inner">
                <ul v-if="active" class="mb-0">
                    <li>
                        <b>Size of extent:</b> {{entry.sizeMm2}}Mm<sup>2</sup>
                    </li>
                    <li>
                        <b>Using area:</b>
                        {{entry.area.name}}
                        <span class="text-info">
                            EPSG:{{entry.area.code}}
                        </span>
                    </li>
                    <li>
                        <b>Deprecated:</b>
                        {{deprecatedText}}
                    </li>
                    <li>
                        <b>Unit:</b>
                        {{unitText}}
                    </li>
                    <li>
                        <b>More info:</b>
                        <a target="_new" :href="epsgOrgLink" v-on:click.stop=''>
                            beta.epsg.org
                        </a>
                        |
                        <a target="_new" :href="epsgIoLink" v-on:click.stop=''>
                            epsg.io
                        </a>
                    </li>
                </ul>
                <ul v-if="active && canReproject" class="d-none d-sm-block mt-0 mb-0">
                    <li v-if="!isCurrentProjection">
                        <span v-if="reprojecting">
                            <b-spinner small variant="secondary" class="mr-1" />Reprojecting...
                        </span>
                        <span class="text-primary" v-on:click="reproject" v-if="!reprojecting">
                            Reproject map into this
                        </span>
                    </li>
                    <li v-if="isCurrentProjection">
                        <span v-if="reprojecting">
                            <b-spinner small variant="secondary" class="mr-1" />Reprojecting...
                        </span>
                        <span v-if="!reprojecting">
                            This is the current projection.
                        </span>
                        <span class="text-primary" v-on:click="reset" v-if="!reprojecting">
                           Reset to EPSG:3857
                        </span>
                    </li>
                </ul>
                
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
    .entry {
        cursor: pointer;
        border: 3px solid rgba(0,0,0,0);
        line-height: 1em;
        padding: 4px;
        background-color: rgba(255, 255, 255, 0.5);
        .btn-deselect {
            width: 22px;
            height: 22px;
            padding: 0px;
        }
        .inner {
            font-size: 0.85em;
            line-height: 1.2em;
            ul {
                margin-top: 5px;
                margin-bottom: 5px;
                padding-left: 18px;
            }
            tt {
                font-size: 1.3em;
            }
        }
    }
</style>

<script>
    import {fromExtent as polygonFromExtent} from 'ol/geom/Polygon.js'
    import {transformExtent} from 'ol/proj'
    import Feature from 'ol/Feature'
    import {Style, Stroke, Text, Fill} from 'ol/style'
    import GeoJSON from 'ol/format/GeoJSON'
    import {getExtentSource, getMap} from '@/map/interface.js'
    import {reproject} from '@/map/projection.js'
    import randomColor from 'randomcolor'
    import {mapState} from 'vuex'
    import axios from 'axios'
    import {BIconX, BSpinner} from 'bootstrap-vue'

    export default {
        components: {
            BIconX,
            BSpinner
        },
        props: {
            entry: Object,
        },
        data: function() {
            return {
                active: false,
                extentFeature: null,
                areaFeature: null,
                locked: false,
                reprojecting: false
            }
        },
        computed: {
            epsgIoLink() {
                return "http://epsg.io/" + this.entry.code
            },
            epsgIoAreaLink() {
                return "http://epsg.io/" + this.entry.area.code + "-area"
            },
            extentId() {
                return "epsg" + this.entry.code + "extent" + this.entry.area.code
            },
            areaId() {
                return "epsg" + this.entry.code + "area" + this.entry.area.code
            },
            extent() {
                return this.entry.extent
            },
            extentTransformed() {
                return transformExtent(this.extent, 'EPSG:3857', this.projection)
            },
            deprecatedText() {
                return this.entry.deprecated ? "Yes" : "No"
            },
            unitText() {
                return this.entry.unit == "unknown" ? "Mixed or unknown" : this.entry.unit
            },
            epsgOrgLink() {
                return "http://beta.epsg.org/crs_"
                    + this.entry.code
                    + "/"
                    + this.entry.name.toString()
                        .replace(/\s+/g, '_')      // Replace spaces with _
                        .replace(/[^\w-]+/g, '')   // Remove all non-word chars
                        .replace(/__+/g, '_')      // Replace multiple _ with single _
                    + ".html"
            },
            canReproject() {
                return this.entry.deprecated === false && this.entry.type == "ProjectedCRS"
            },
            color() {
                return randomColor({
                    format: 'rgba',
                    luminosity: 'light',
                    alpha: 1
                })
            },
            borderColor() {
                return this.active ? this.color : 'rgba(0,0,0,0)'
            },
            extentStyle() {
                const c = this.color
                const name = "EPSG Area " + this.entry.area.code
                return new Style({
                    stroke: new Stroke({
                        color: c,
                        width: 2,
                        lineCap: "square"
                    }),
                    text: new Text({
                        font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                        placement: 'line',
                        fill: new Fill({
                            color: c
                        }),
                        textBaseline: 'bottom',
                        text: name
                    })
                })
            },
            areaStyle() {
                const c = this.color
                return new Style({
                    stroke: new Stroke({
                        color: c,
                        width: 1,
                        lineDash: [2],
                        lineCap: "square"
                    })
                })
            },
            isCurrentProjection() {
                return this.entry.code == this.projection.split(":")[1]
            },
            ...mapState(['sliderSpace', 'hideAll', 'sort', 'projection'])
        },
        watch: {
            hideAll(newVal) {
                if (newVal == true) {
                    this.quickDeselect()
                }
            },
            projection(newVal, oldVal) {
                if (this.active) this.refresh(oldVal, newVal)
            }
        },
        methods: {
            // Handle a map click - either add or remove the entry from the map
            handleClick() {
                if (this.active) this.fitToEntry()
                else this.selectEntry()
            },
            // Add the entry to the screen
            selectEntry() {
                if (this.locked) return
                this.locked = true
                this.active = true
                this.$emit("select", true)

                let extentPolygon = polygonFromExtent(this.extent)
                extentPolygon.transform('EPSG:3857', this.projection)
                this.extentFeature = new Feature(extentPolygon)
                this.extentFeature.setId(this.extentId)
                this.extentFeature.setStyle(this.extentStyle)

                let source = getExtentSource()

                // Keep track of the amount of features added and unlock this
                // component when done. This allows us to add the extent
                // immediately while we wait for the async load of the GeoJSON.
                let featuresAdded = 0
                const addFeatureListener = () => {
                    featuresAdded++;
                    if (featuresAdded == 2) {
                        this.locked = false
                        this.fitToEntry()
                        source.un('addfeature', addFeatureListener)
                    }
                }
                source.on('addfeature', addFeatureListener)

                // Add the extent immediately
                source.addFeature(this.extentFeature)

                // Fetch the GeoJSON then add the detailed area feature
                this.getAreaShape().then((areaFeature) => {
                    this.areaFeature = areaFeature
                    source.addFeature(this.areaFeature)
                })
            },
            // Fit the view around the extent, allowing for the  slider tray on
            // the left.
            fitToEntry() {
                const left = 20 + this.sliderSpace;
                getMap().getView().fit(this.extentTransformed, {
                    padding: [20, 20, 20, left]
                })
            },
            // Remove the entry from the map
            deselectEntry() {
                if (this.locked) return
                this.locked = true
                this.active = false
                this.$emit("select", false)

                let source = getExtentSource()
                source.once('removefeature', () => {
                    this.locked = false
                })
                source.removeFeature(this.extentFeature)
                source.removeFeature(this.areaFeature)
            },
            // Refresh the geometries when the projection changes
            refresh(from, to) {
                let extentGeom = this.extentFeature.getGeometry()
                let areaGeom = this.areaFeature.getGeometry()

                extentGeom.transform(from, to)
                areaGeom.transform(from, to)

                if (this.reprojecting) {
                    this.fitToEntry()
                    this.reprojecting = false
                }
            },
            // Quickly deselect this entry, assuming something else is clearing
            // all the features.
            quickDeselect() {
                if (this.active) {
                    this.locked = false
                    this.active = false
                    this.$emit("select", false)
                }
            },
            // Get the detailed GeoJSON file for this entry's area
            getAreaShape() {
                return axios.get(
                    "/data/out/shapes/area-" + this.entry.area.code + ".json"
                ).then((response) => {
                    const features = (new GeoJSON({
                        dataProjection: 'EPSG:4326',
                    })).readFeatures(
                        response.data, {featureProjection: this.projection}
                    )
                    const feature = features[0]
                    feature.setStyle(this.areaStyle)
                    return feature
                })
            },
            reproject() {
                this.reprojecting = true
                reproject(this.entry.code, this.extent)
            },
            reset() {
                this.reprojecting = true
                reproject('3857')
            }
        }
    }
</script>