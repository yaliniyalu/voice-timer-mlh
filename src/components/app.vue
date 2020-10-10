<template>
    <f7-app :params="f7params" >

        <!-- Views/Tabs container -->
        <f7-views tabs class="safe-areas">
            <!-- Tabbar for switching views-tabs -->
            <f7-toolbar tabbar labels bottom>
                <f7-link tab-link="#view-stopwatch" tab-link-active icon-ios="f7:stopwatch_fill" icon-md="material:watch_later" text="Stopwatch"></f7-link>
                <f7-link tab-link="#view-timer" icon-ios="f7:timer_fill" icon-md="material:timer" text="Timer"></f7-link>
                <f7-link tab-link="#view-about" icon-ios="f7:info_circle_fill" icon-md="material:info" text="About"></f7-link>
            </f7-toolbar>

            <f7-view id="view-home" main tab tab-active url="/"></f7-view>
            <f7-view id="view-stopwatch" name="stopwatch" tab url="/stopwatch/" @tab:show="tabsShow"></f7-view>
            <f7-view id="view-timer" name="timer" tab url="/timer/" @tab:show="tabsShow"></f7-view>
            <f7-view id="view-about" name="about" tab url="/about/" @tab:show="tabsShow"></f7-view>

        </f7-views>
    </f7-app>
</template>
<script>
import { Device }  from 'framework7/framework7-lite.esm.bundle.js';
import cordovaApp from '../js/cordova-app.js';
import routes from '../js/routes.js';
import pageManager from "../js/page-manager";

export default {
    data() {
        return {
            // Framework7 Parameters
            f7params: {
                id: 'tk.yalini.todomlh', // App bundle ID
                name: 'TodoMLH', // App name
                theme: 'auto', // Automatic theme detection

                // App root data
                data: function () {
                    return {

                    };
                },

                // App routes
                routes: routes,

                // Register service worker
                serviceWorker: Device.cordova ? {} : {
                    path: '/service-worker.js',
                },
                // Input settings
                input: {
                    scrollIntoViewOnFocus: Device.cordova && !Device.electron,
                    scrollIntoViewCentered: Device.cordova && !Device.electron,
                },
                // Cordova Statusbar settings
                statusbar: {
                    iosOverlaysWebView: true,
                    androidOverlaysWebView: false,
                },
            },
        }
    },
    methods: {
        tabsShow(el) {
            const page = el.id.replace('view-', '');
            pageManager.setCurrentPage(page);
        }
    },
    mounted() {
        this.$f7ready((f7) => {
            // Init cordova APIs (see cordova-app.js)
            if (Device.cordova) {
                cordovaApp.init(f7);
            }

            pageManager.on('open', ({ page }) => {
                f7.tab.show('#view-' + page, true)
            });


            // Call F7 APIs here
        });


        pageManager.setCurrentPage('stopwatch');
    }
}
</script>