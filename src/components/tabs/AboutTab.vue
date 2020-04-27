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
            <div class="col-sm-8 col-xs-12 spaced">
                <p>
                    Geodesy is a quick spatial search engine for the EPSG Geodetic Parameter Registry.
                </p>
                <p>
                    This app helps you to find useful EPSG entries around a particular location:
                </p>
                <ul>
                    <li>Click the map</li>
                    <li>Get a list of entries immediately</li>
                    <li>Sort and filter using some pragmatic tools</li>
                    <li>View extents and areas rightaway</li>
                    <li>Reproject the map (for some CRS only)
                    <li>Click through to epsg.io for more info</li>
                </ul>
                <p>
                    It works on phones, too.
                </p>
                <h2>Limitations</h2>
                <p>
                    At the moment, it only displays EPSG entries of the GML types:
                </p>
                <ul>
                    <li><tt class="text-danger">ProjectedCRS</tt></li>
                    <li><tt class="text-danger">GeodeticCRS</tt></li>
                </ul>
                <p>
                    I'll be adding more in the next few weeks or open an issue to request a GML type to be added.
                </p>
                <p>
                    The search filters are pragmatic. For example, the units <tt class="text-danger">foot</tt> and <tt class="text-danger">US survey foot</tt> are lumped into one filter. For a very precise search, try the <a href="http://www.epsg-registry.org/">EPSG Registry</a> itself.
                </p>
                <h2>Issues and Feedback</h2>
                <p>
                    Reports of any bugs, errors or feedback welcome... please open an issue at the GitHub repo: <a href="https://github.com/sfreytag/geosearch/issues">https://github.com/sfreytag/geosearch/issues</a>
                </p>
                <h2>About Me</h2>
                <p>
                    I'm Simon Freytag and I like building web apps, particularly those that use maps. I work freelance so if you need something similar, please <a href="http://www.freytag.org.uk">get in touch</a>!
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
    export default {
    }
</script>