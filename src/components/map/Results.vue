<!--
Results
Display the list of results from a map search.
-->

<template>
    <transition name="slide">
        <div class="results d-flex flex-column" :style="{left: left}">
            <p class="text-right p-2" v-if="!hasResults">
                <b-icon-justify class="icon text-primary" font-scale="2" v-on:click="toggle"/>
            </p>
            <div class="px-4 pt-0 text-center" v-if="!hasResults">
                <p>
                    Geodesy is a quick spatial search engine for the EPSG Geodetic Parameter Registry.
                </p>
                <p>
                    <img src="/gfx/logo.png" width="100" height="100" alt="" />
                </p>
                <p>
                    Click the map to begin a search.
                </p>
            </div>

            <div class="tools p-2" v-if="hasResults">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="h5 mb-0">Search Results</span>
                    <b-icon-justify class="icon text-primary" font-scale="2" v-on:click="toggle"/>
                </div>
            </div>

            <div v-if="hasResults" class="tools lower px-2 pb-2 d-flex justify-content-between">
                <button class="btn btn-outline-primary btn-sm"
                    v-on:click="clearSearch">
                    Clear search
                </button>

                <button class="btn btn-outline-primary btn-sm"
                    :disabled="activeCount == 0"
                    v-on:click="hideAll">
                    Hide all
                </button>

                <sort-filter></sort-filter>
            </div>

            <div v-if="hasResults" class="scroll-container px-2 pt-2">
                <div class="mb-2 font-weight-bold">
                    {{sortedResults.length}} results
                </div>
                <div v-for="r in sortedResults" :key="r.code" class="mb-2">
                    <epsg-entry :entry="r" @select="onEntrySelection"/>
                </div>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
    .results {
        background-color: #aaa;
        position: absolute;
        top: 54px;
        bottom: 0;
        width: 306px;
        transition: left 0.5s;
        .tools {
            background-color: #ddd;
            &.lower {
                border-bottom: 1px solid #999;
            }
        }
        .list {
            background-color: #999;
        }
        .scroll-container {
            height: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
        }
    }

    .row.title {
        .col {
            background-color: #ddd;
        }
    }

    .icon {
        cursor: pointer;
    }
</style>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex'
    import EpsgEntry from './EpsgEntry.vue'
    import {BIconJustify} from 'bootstrap-vue'
    import {getExtentSource} from '@/map/interface.js'
    import SortFilter from './SortFilter.vue'

    const breakPoint = 576

    export default {
        data: function() {
            return {
                open: true,
                activeCount: 0,
            }
        },
        components: {
            'epsg-entry': EpsgEntry,
            'b-icon-justify': BIconJustify,
            'sort-filter': SortFilter
        },
        computed: {
            hasResults() {
                return this.results.length > 0
            },
            left() {
                const left = this.open ? '0' : '-262px'
                const deadSpace = this.open ? 306 : 44
                this.setSliderSpace(deadSpace)
                return left
            },
            ...mapState(['results']),
            ...mapGetters(['sortedResults'])
        },
        watch: {
            activeCount(newVal) {
                if (newVal == 0) {
                    this.setHideAll(false)
                }
            },
            results(newVal) {
                if (newVal.length > 0)
                    this.open = true
                else if (newVal.length == 0 && window.innerWidth < breakPoint)
                    this.open = false
            }
        },
        methods: {
            toggle() {
                this.open = !this.open
            },
            onEntrySelection(active) {
                if (active) {
                    this.activeCount++
                    if (window.innerWidth < breakPoint && this.open) this.toggle()
                }
                else this.activeCount--
            },
            hideAll() {
                let source = getExtentSource()
                source.clear()
                this.setHideAll(true)
            },
            clearSearch() {
                this.$emit('clear-search')
            },
            ...mapMutations(['setSliderSpace', 'setHideAll'])
        },
        created() {
            if (window.innerWidth < breakPoint) this.open = false
        }
    }
</script>