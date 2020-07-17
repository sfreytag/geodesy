
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
    import BingMaps from 'ol/source/BingMaps'
    import {Map} from 'ol'
    import Attribution from 'ol/control/Attribution'
    import Feature from 'ol/Feature'
    import Point from 'ol/geom/Point'
    import {Style, Icon} from 'ol/style'
    import {setMap, setExtentSource, setReticleLayer, origin} from '@/map/interface.js'

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
                    projection: this.projection,
                    source: new BingMaps({
                        key: 'At4XyvAW75dvip5o0twwOLJ2RxFMOm9YbzyBziHZqR5nEmq07R3L_GVYfckZowam',
                        imagerySet: 'CanvasDark'
                    }),
                })

                const a = new Attribution({collapsible: true, collapsed: true})
                let m = new Map({
                    target: this.$refs.map,
                    controls: [a],
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