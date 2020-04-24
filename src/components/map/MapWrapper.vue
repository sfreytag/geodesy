<!--
MapWrapper
Sets up the ol map and exposes useful things to the rest of the app by setting
them in the map interface.
-->

<template>
    <div class="map-container">
        <div ref="map" class="map"></div>
    </div>
</template>

<style lang="scss" scoped>

.map, .map-container {
    width: 100%;
    height: 100%;
}

</style>

<script>
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
    import {Vector as VectorSource} from 'ol/source'
    import OSM from 'ol/source/OSM'
    import {Map, View} from 'ol'
    import {transform} from 'ol/proj'
    import {defaults as defaultControls} from 'ol/control';
    import {setMap, setExtentSource, setReticleLayer} from '../../map/interface.js'
    import Feature from "ol/Feature"
    import Point from 'ol/geom/Point'
    import {Style, Icon} from "ol/style"

    export default {
        mounted: function() {
            this.buildMap()
        },
        methods: {
            buildMap() {
                // Configure source and layer for rendering extents
                let extentSource = new VectorSource({})
                setExtentSource(extentSource)
                let extentLayer = new VectorLayer({
                    source: extentSource,
                })

                // Configure features, source and layer for the reticle
                let reticleFeature = new Feature({
                    geometry: new Point([0, 0]),
                })
                let reticleStyle = new Style({
                    image: new Icon({
                        src: '/gfx/reticle.png'
                    })
                })
                reticleFeature.setStyle(reticleStyle)
                reticleFeature.setId("reticle")
                let reticleLayer = new VectorLayer({
                    source: new VectorSource({
                        features: [reticleFeature]
                    }),
                })
                reticleLayer.setVisible(false)
                setReticleLayer(reticleLayer)

                let mapLayer = new TileLayer({
                    projection: 'EPSG:3857',
                    source: new OSM(),
                    className: 'bw-filter',
                    opacity: 0.7
                })

                const origin = new View({
                    center: transform(
                        [0, 50], 'EPSG:4326', 'EPSG:3857'
                    ),
                    zoom: 4,
                    projection: 'EPSG:3857',
                    multiWorld: true
                })

                let m = new Map({
                    target: this.$refs.map,
                    controls: defaultControls(),
                    layers: [mapLayer, extentLayer, reticleLayer],
                    view: origin
                })
                m.on("singleclick", (event) => {
                    this.$emit("map-singleclick", event)
                })
                setMap(m)
            }
        }
    }
</script>