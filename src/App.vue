<template>
    <div id="app">
        <tutter-header class="d-lg-none" />
        <b-container>
            <b-row>
                <b-col lg="3" class="bv-d-md-down-none">
                    <div id="sidebarContainer">
                        <tutter-sidebar/>
                    </div>
                </b-col>
                <b-col lg="9">
                    <router-view :key="$route.fullPath"/>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import TutterSidebar from "@/components/TutterSidebar.vue";
import TutterHeader from "@/components/TutterHeader.vue";

export default defineComponent({
    components: {TutterHeader, TutterSidebar}
})
</script>

<style scoped>
div#sidebarContainer {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
}
</style>
