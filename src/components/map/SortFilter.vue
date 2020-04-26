<template>
    <b-dropdown variant="outline-primary"
        dropright
        text="Sort and filter"
        size="sm"
        ref="sortFilterDD">

        <div class="close btn btn-sm btn-secondary rounded-circle"
            v-on:click="hideDD">&times;</div>

        <b-dropdown-form>
            <b-form-group class="text-nowrap" label="Sort by" label-class="font-weight-bold">
                <b-form-radio v-model="sort" value="size">
                    <span class="text-sm">Size in Mm<sup>2</sup></span>
                </b-form-radio>
                <b-form-radio v-model="sort" value="code">
                    <span class="text-sm">EPSG Code</span>
                </b-form-radio>
                <b-form-radio v-model="sort" value="name">
                    <span class="text-sm">Name</span>
                </b-form-radio>
            </b-form-group>

            <b-form-group class="text-nowrap" label="Deprecated entries" label-class="font-weight-bold">
                <b-form-checkbox v-model="deprecated">
                    <span class="text-sm">Show deprecated entries</span>
                </b-form-checkbox>
            </b-form-group>

            <b-form-group class="text-nowrap mb-0" label="Types" label-class="font-weight-bold">
                <b-form-checkbox v-model="typeProjectedCrs">
                    <span class="text-sm">Projected CRS</span>
                </b-form-checkbox>
                <b-form-checkbox v-model="typeGeodeticCrs">
                    <span class="text-sm">Geodetic CRS</span>
                </b-form-checkbox>
            </b-form-group>
        </b-dropdown-form>
    </b-dropdown>
</template>

<style lang="scss" scoped>
    .close {
        position: absolute;
        right: 10px;
        top: 10px;
        text-shadow: none;
    }
</style>

<script>
    import {mapState} from 'vuex'
    import {
        BDropdown, BDropdownForm, BFormCheckbox, BFormGroup, BFormRadio
    } from 'bootstrap-vue'

    /**
     * mapFiltersGettersSetters
     * Reduce boilerplate by automatically creating the getters and setters for
     the store's filter properties.
     */
   function mapFiltersGettersSetters() {
        const filters = ['deprecated', 'typeProjectedCrs', 'typeGeodeticCrs']
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
            'b-dropdown': BDropdown,
            'b-dropdown-form': BDropdownForm,
            'b-form-checkbox': BFormCheckbox,
            'b-form-group': BFormGroup,
            'b-form-radio': BFormRadio
        },
        computed: {
            sort: {
                get() {return this.$store.state.sort},
                set(s) {this.$store.commit('setSort', s)}
            },
            ...mapFiltersGettersSetters(),
            ...mapState(['filters']),
        },
        methods: {
            hideDD() {
                this.$refs.sortFilterDD.hide()
            }
        }
    }
</script>