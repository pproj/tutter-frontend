<template>
    <div id="app">
        <b-container>
            <b-row class="d-xl-none">
                <b-col class="my-2">
                    <b-link :to="{ name: 'home' }">
                        <img src="@/assets/tutter_with_text.svg" alt="Tutter logo" height="50px"/>
                    </b-link>
                    <b>@marcsello</b>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="3" class="bv-d-lg-down-none">
                    <div id="sidebarContainer">
                        <tutter-sidebar/>
                        <div id="tutterFooter" class="text-center">
                            Carefully crafted for <b-link href="https://pproj.net">PP 2023</b-link><br>
                            <b-link href="/api">API Docs</b-link>
                        </div>
                    </div>
                </b-col>
                <b-col lg="9">
                    <router-view/>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import TutterSidebar from "@/components/TutterSidebar.vue";

export default defineComponent({
    components: {TutterSidebar}
})
</script>

<style scoped>
div#sidebarContainer {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
}

div#tutterFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: -10;
}
</style>
