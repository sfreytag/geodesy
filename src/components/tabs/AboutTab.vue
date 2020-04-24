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
            <div class="col-8">
                <p>
                    Geodesy is a quick spatial search engine for the EPSG Geodetic Parameter Registry.
                </p>
                <p>
                    This app helps you to find all the EPSG entries around a particular location:
                </p>
                <ul>
                    <li>Click the map.</li>
                    <li>Get a list of entries immediately.</li>
                    <li>View their extents rightaway.</li>
                    <li>Click through to other sites (epsg.io) for all the info once you've found what you're looking for.</li>
                </ul>
                <h2>Limitations</h2>
                <p>
                    At the moment, it only displays EPSG entries of the GML type <tt class="text-danger">ProjectedCRS</tt>. I'll be adding more in the next few weeks.
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
    .col-8 {
        line-height: 2em;
    }
    h2 {
        font-weight: 300
    }
</style>

<script>
    export default {
    }
</script>