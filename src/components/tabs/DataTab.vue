<!--
AboutTab
Info about the app.
-->
<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="tab-title display-3 border-bottom border-primary mb-2">More about the data</div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-8 col-xs-12 spaced">
                <p>
                    Here's some more information about which entries of the EPSG Geodetic Parameter Registry are searched by this app.
                </p>
                <p>
                    The EPSG Geodetic Paramter Registry is made available as a GML dictionary consisting
                    of a list of entries, each of a GML type.
                <p>
                    Each map click returns EPSG entries surrounding that location, which are of the GML type:
                </p>
                <ul>
                    <li><tt class="text-danger">epsg:ExtentDefinition</tt></li>
                </ul>
                <p>
                    The areas are used as an index to lookup CRS for the requested location. These are the results listed on the left and are of the following GML types:
                </p>
                <ul>
                    <li><tt class="text-danger">gml:ProjectedCRS</tt></li>
                    <li><tt class="text-danger">gml:GeodeticCRS</tt> (geocentric, geographic 2D and geographic 3D)</li>
                    <li><tt class="text-danger">gml:VerticalCRS</tt></li>
                    <li><tt class="text-danger">gml:CompoundCRS</tt></li>
                    <li><tt class="text-danger">gml:EngineeringCRS</tt></li>
                </ul>
                <p>
                    The remaining GML types in the registry are used by the CRSs returned above and/or are not
                    directly searchable via their own extents, and so are not returned in the results.
                    To find out more about them, click the map to get a list of CRSs, then for each one,
                    click through to epsg.io or to the EPSG Registry.
                </p>
                <ul>
                    <li><tt class="text-danger">epsg:AxisName</tt></li>
                    <li><tt class="text-danger">gml:CartesianCS</tt></li>
                    <li><tt class="text-danger">gml:VerticalCS</tt></li>
                    <li><tt class="text-danger">gml:EllipsoidalCS</tt></li>
                    <li><tt class="text-danger">gml:SphericalCS</tt></li>
                    <li><tt class="text-danger">gml:Transformation</tt></li>
                    <li><tt class="text-danger">gml:Conversion</tt></li>
                    <li><tt class="text-danger">gml:ConcatenatedOperation</tt></li>
                    <li><tt class="text-danger">gml:GeodeticDatum</tt></li>
                    <li><tt class="text-danger">gml:VerticalDatum</tt></li>
                    <li><tt class="text-danger">gml:EngineeringDatum</tt></li>
                    <li><tt class="text-danger">epsg:Deprecation</tt></li>
                    <li><tt class="text-danger">gml:Ellipsoid</tt></li>
                    <li><tt class="text-danger">gml:PrimeMeridian</tt></li>
                    <li><tt class="text-danger">gml:OperationMethod</tt></li>
                    <li><tt class="text-danger">epsg:NamingSystem</tt></li>
                    <li><tt class="text-danger">gml:OperationParameter</tt></li>
                    <li><tt class="text-danger">epsg:Supersession</tt></li>
                    <li><tt class="text-danger">gml:ConventionalUnit</tt></li>
                    <li><tt class="text-danger">gml:BaseUnit</tt></li>
                    <li><tt class="text-danger">epsg:VersionHistory</tt></li>
                    <li><tt class="text-danger">epsg:ChangeRequest</tt></li>
                </ul>
                <p>
                    The relationship between these types is clearly explained by a relationship diagram
                    published by the EPSG, copied below. The spatial search index used by this app enters 
                    through the yellow Areas of Use at the top, then follows through to the red Coordinate 
                    Reference Systems. The remaining entries are ignored for now.
                </p>
                <p>
                    <img class="w-100" src="/gfx/relations.png" />
                </p>
                <p>
                    However, if you think some of this unused data would be useful in this app, open
                    an issue in <a href="https://github.com/sfreytag/geodesy/issues">GitHub</a> and it
                    can probably be added.
                </p>
                <p class="mb-5">
                    <button class="btn btn-primary" v-on:click="setTab('about')">Back</button>
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .tab-title {
        margin-top: 70px !important;
    }
    tt {
        font-size: 1.3em;
    }
    .spaced {
        line-height: 1.8em;
    }
    h2 {
        font-weight: 300
    }
</style>

<script>
    import {mapMutations} from 'vuex'
    export default {
        methods: {
            ...mapMutations(['setTab'])
        }
    }
</script>