<!--
MapTab
Wraps the MapApp so that it can live in a tab.
-->
<template>
    <div>
        <div class="map-app-container">
            <map-app />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .map-app-container {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>

<script>
    import MapApp from '../map/MapApp.vue';

    export default {
        components: {
            'map-app': MapApp,
        }
    }
</script>