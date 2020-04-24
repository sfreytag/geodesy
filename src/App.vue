<!--
App
The top of the prof finder app. Sets up some tabs and the navigation between
them.
-->

<template>
    <div class="app-container">

        <transition name="component-fade" mode="out-in">
            <map-tab v-if="tab == 'map'" />
            <about-tab v-if="tab == 'about'" />
        </transition>

        <div class="controls-container">
            <div class="controls d-flex align-items-center bg-white p-2">

                <img src="/gfx/logo.png" width="38" height="38" alt="" class="mr-1" />

                <h5 class="mb-0 mr-2">Geodesy</h5>

                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <span class="nav-link"
                            :class="{active: tab == 'map', 'text-primary': tab != 'map'}"
                            @click="navigate('map')">
                            Map Search
                        </span>
                    </li>
                    <li class="nav-item">
                        <span class="nav-link"
                            :class="{active: tab == 'about', 'text-primary': tab != 'about'}"
                            @click="navigate('about')">
                            About
                        </span>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import './scss/app.scss';
</style>

<style lang="scss" scoped>
    .controls-container {
        position: absolute;
        left: 0;
        top: 0;
    }

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .5s ease;
    }

    .component-fade-enter, .component-fade-leave-to {
        opacity: 0;
    }

    .nav-link {
        cursor: pointer;
        transition: background-color .5s ease;
    }
</style>

<script>
    import MapTab from './components/tabs/MapTab.vue';
    import AboutTab from './components/tabs/AboutTab.vue';

    export default {
        components: {
            'map-tab': MapTab,
            'about-tab': AboutTab,
        },
        data: function() {
            return {
                tab: 'map'
            }
        },
        methods: {
            navigate: function(tab) {
                this.tab = tab;
            }
        }
    }
</script>
