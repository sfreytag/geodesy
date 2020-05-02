<template>

<div>

<button class="btn btn-outline-primary btn-sm"
    size="sm"
    ref="sortFilterDD"
    v-on:click="toggle">
    Sort and filter ❯
</button>

<transition name="fade">
    <div class="sortFilterTray p-2" v-if="open" :style="{left: left}">

        <div class="close btn btn-sm btn-secondary rounded-circle d-flex justify-content-center align-items-center"
            v-on:click="toggle">
            &times;
        </div>

        <form>
            <div class="form-group">
                <label class="font-weight-bold">Sort</label>
                <b-form-radio v-model="sort" value="size">
                    <span class="text-sm">Size in Mm<sup>2</sup></span>
                </b-form-radio>
                <b-form-radio v-model="sort" value="code">
                    <span class="text-sm">EPSG Code</span>
                </b-form-radio>
                <b-form-radio v-model="sort" value="name">
                    <span class="text-sm">Name</span>
                </b-form-radio>
            </div>

             <div class="form-group">
                <label class="font-weight-bold">Deprecated entries</label>
                <b-form-checkbox v-model="deprecated">
                    <span class="text-sm">Show deprecated entries</span>
                </b-form-checkbox>
            </div>

             <div class="form-group">
                <label class="font-weight-bold">Types</label>
                <b-form-checkbox v-model="typeProjectedCrs">
                    <span class="text-sm">Projected CRS</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="typeGeodeticCrs">
                    <span class="text-sm">Geodetic CRS</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="typeVerticalCrs">
                    <span class="text-sm">Vertical CRS</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="typeCompoundCrs">
                    <span class="text-sm">Compound CRS</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="typeEngineeringCrs">
                    <span class="text-sm">Engineering CRS</span>
                </b-form-checkbox>
            </div>

            <div class="form-group">
                <label class="font-weight-bold">Units</label>
                <b-form-checkbox v-model="unitMetre">
                    <span class="text-sm">Metre</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="unitFoot">
                    <span class="text-sm">Foot</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="unitDegree">
                    <span class="text-sm">Degree</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="unitUnknown">
                    <span class="text-sm">Mixed or unknown</span>
                </b-form-checkbox>
            </div>

             <div class="form-group">
                <label class="font-weight-bold">Size</label>
                <div class="text-sm">Spherical area in Mm<sup>2</sup></div>
                <div class="px-2">
                    <vue-slider v-model="slider"
                        :enable-cross="false"
                        :min="0"
                        :max="550"
                        :interval="10"
                        @change="onSliderChange" />
                </div>
                <div class="text-sm d-flex justify-content-between">
                    <span>Country</span>
                    <span>Continent</span>
                    <span>World</span>
                </div>
            </div>

            <div class="form-group">
                <label class="font-weight-bold">Wildcards</label>
                <b-form-checkbox v-model="includeWgs">
                    <span class="text-sm">Include all with 'WGS'</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="includeUtm">
                    <span class="text-sm">Include all with 'UTM'</span>
                </b-form-checkbox>
            </div>
        </form>
    </div>
</transition>

</div>

</template>

<style lang="scss" scoped>
    .close {
        position: absolute;
        right: 10px;
        top: 10px;
        text-shadow: none;
        width: 22px;
        height: 22px;
        padding-top: 2px;
    }

    .sortFilterTray {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 200px;
        overflow-y: scroll;
        background-color: #ddd;
        transition: left 0.5s;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

<script>
    import {mapState} from 'vuex'
    import {BFormCheckbox, BFormRadio} from 'bootstrap-vue'
    import VueSlider from 'vue-slider-component'

    /**
     * mapFiltersGettersSetters
     * Reduce boilerplate by automatically creating the getters and setters for
     the store's filter properties.
     */
   function mapFiltersGettersSetters() {
        const filters = [
            'deprecated', 'typeProjectedCrs', 'typeGeodeticCrs', 'unitMetre',
            'unitFoot', 'unitDegree', 'unitUnknown', 'areaMin', 'areaMax',
            'includeWgs', 'includeUtm', 'typeVerticalCrs', 'typeCompoundCrs',
            'typeEngineeringCrs'
        ]
        const computeds = {}
        filters.forEach((f) => {
            computeds[f] = {
                get() {return this.$store.state.filters[f]},
                set(val) {this.$store.commit('set' + capitalise(f), val)}
            }
        })
        return computeds
    }

    /**
     * capitalise
     * Utility func
     */
    function capitalise(s) {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    export default {
        components: {
            'b-form-checkbox': BFormCheckbox,
            'b-form-radio': BFormRadio,
            'vue-slider': VueSlider
        },
        computed: {
            sort: {
                get() {return this.$store.state.sort},
                set(s) {this.$store.commit('setSort', s)}
            },
            left() {
                // Default position
                let left = 306
                // Available space
                let space = window.innerWidth - this.sliderSpace
                // If there is not enough space, instead position its right
                // endge on the RH of the screen
                if (200 > space) left = window.innerWidth - 200
                return left + "px"
            },
            ...mapFiltersGettersSetters(),
            ...mapState(['filters', 'sliderSpace']),
        },
        data () {
            return {
                open: false,
                slider: [0, 550],
                busy: false
            }
        },
        methods: {
            toggle() {
                this.open = !this.open
            },
            onSliderChange() {
                if (this.busy) return
                this.busy = true
                this.areaMin = this.slider[0]
                this.areaMax = this.slider[1]
                window.setTimeout(() => {
                    this.busy = false
                }, 500)
            }
        }
    }
</script>