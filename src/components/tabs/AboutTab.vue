<!--
AboutTab
Info about the app.
-->
<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="tab-title display-3 border-bottom border-primary mb-2">About</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h4 class="font-weight-light my-3">
                    Geodesy is a quick spatial search engine for the EPSG Geodetic Parameter Registry.
                </h4>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-8 col-xs-12 spaced">
                <p>
                    It helps you quickly find Cordinate Reference Systems (CRS) around a particular location:
                </p>
                <ul>
                    <li>Click the map</li>
                    <li>Get a list of CRS immediately</li>
                    <li>Sort and filter using some pragmatic tools</li>
                    <li>View and compare CRS extents and areas on the same map</li>
                    <li>Reproject the map (for some CRS only)
                    <li>Click through to epsg.io for more info</li>
                </ul>
                <p>
                    It works on phones, too!
                </p>
                <h2>Search filters</h2>
                <p>
                    The search filters are pragmatic/fuzzy. For example, the units <tt class="text-danger">foot</tt>
                    and <tt class="text-danger">US survey foot</tt> are lumped into one filter. This is intended to
                    make it quicker to find things in return for an acceptable loss of precision. For a very precise
                    search, try the <a href="http://www.epsg-registry.org/">EPSG Registry</a> itself.
                </p>
                <h2>Data</h2>
                <p>
                    Here's
                    <span class="text-primary text-link" v-on:click="setTab('data')">
                        more information about the data
                    </span>
                    being searched by this app.
                </p>
                <h2>Issues and feedback</h2>
                <p>
                    Reports of any bugs, errors or feedback welcome... please open an issue at the GitHub repo: <a href="https://github.com/sfreytag/geosearch/issues">https://github.com/sfreytag/geosearch/issues</a>
                </p>
                <h2>About me</h2>
                <p class="mb-5">
                    I'm Simon Freytag and I like building web apps, particularly those that use maps. I work freelance so if you need something similar, please <a href="http://www.freytag.org.uk">get in touch</a>.
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