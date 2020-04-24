<!--
Results
Display the list of results from a map search.
-->

<template>
    <transition name="slide">
        <div class="results d-flex flex-column" :style="{left: left}">
            <div class="p-4 text-center" v-if="!hasResults">
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
                    <span class="text-link text-primary btn-sm p-0 mt-1" v-on:click="clearSearch">Clear search</span>
                    <b-icon-justify class="icon text-primary" font-scale="2" v-on:click="toggle"/>
                </div>
            </div>

            <div v-if="hasResults" class="tools lower px-2 pb-2 d-flex justify-content-between">
                <div>
                    <b-dropdown variant="outline-primary"
                        text="Order by"
                        size="sm">
                        <b-dropdown-item v-on:click="setSort('size')">
                            <span :class="{'font-weight-bold': sort == 'size'}">
                                Size in Mm<sup>2</sup>
                            </span>
                        </b-dropdown-item>
                        <b-dropdown-item v-on:click="setSort('code')">
                            <span :class="{'font-weight-bold': sort == 'code'}">
                                EPSG Code
                            </span>
                        </b-dropdown-item>
                        <b-dropdown-item v-on:click="setSort('name')">
                            <span :class="{'font-weight-bold': sort == 'name'}">
                                Name
                            </span>
                        </b-dropdown-item>
                    </b-dropdown>
                </div>

                <div>
                    <b-dropdown variant="outline-primary"
                        text="Filters"
                        size="sm">
                        <b-dropdown-form class="p-2">
                            <b-form-group class="text-nowrap mb-0">
                                <b-form-checkbox v-model="filters.deprecated">Include deprecated</b-form-checkbox>
                            </b-form-group>
                        </b-dropdown-form>
                    </b-dropdown>
                </div>


                <button class="btn btn-outline-primary btn-sm"
                    :disabled="activeCount == 0"
                    v-on:click="hideAll">
                    Hide all
                </button>
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
    import {
        BIconJustify, BDropdown, BDropdownItem, BDropdownForm, BFormCheckbox,
        BFormGroup
    } from 'bootstrap-vue'
    import {getExtentSource} from '@/map/interface.js'

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
            'b-dropdown': BDropdown,
            'b-dropdown-item': BDropdownItem,
            'b-dropdown-form': BDropdownForm,
            'b-form-checkbox': BFormCheckbox,
            'b-form-group': BFormGroup
        },
        computed: {
            hasResults() {
                return this.results.length > 0
            },
            left() {
                const left = this.open ? '0' : '-261px'
                const deadSpace = this.open ? 306 : 45
                this.setLeftDeadSpace(deadSpace)
                return left
            },
            ...mapState(['results', 'sort', 'filters']),
            ...mapGetters(['sortedResults'])
        },
        watch: {
            activeCount(newVal) {
                if (newVal == 0) {
                    this.setHideAll(false)
                }
            }
        },
        methods: {
            toggle() {
                this.open = !this.open
            },
            onEntrySelection(active) {
                if (active) this.activeCount++
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
            ...mapMutations(['setLeftDeadSpace', 'setHideAll', 'setSort'])
        }
    }
</script>