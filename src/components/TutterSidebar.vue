<template>
    <div>
        <div style="background-color: white">
            <div class="py-5 text-right">
                <b-link :to="{ name: 'home' }">
                    <img src="@/assets/tutter_with_text.svg" alt="Tutter logo" class="w-100"/>
                </b-link>
                <b v-if="user.isUsernameSet">@{{ user.username }}</b>
                <div v-else>&nbsp;</div> <!-- webdesign is my passion -->
            </div>
            <div class="py-5">
                <h2>Trending tags</h2>
                <div id="trendingTagsHolder" class="w-100 text-wrap text-justify">
                    <b-link :to="{name: 'tag', params: {tag: 'lofasz'}}">#lofasz </b-link>
                    <b-link>#lofas </b-link>
                    <b-link>#lof </b-link>
                    <b-link>#lofsz </b-link>
                    <b-link>#lofaasz </b-link>
                    <b-link>#lofaaasz </b-link>
                    <b-link>#lofasz </b-link>
                    <b-link>#lofas </b-link>
                    <b-link>#lof </b-link>
                    <b-link>#lofsz </b-link>
                    <b-link>#lofaasz </b-link>
                    <b-link>#lofaaasz </b-link>
                    <b-link>#lofasz </b-link>
                    <b-link>#lofas </b-link>
                    <b-link>#lof </b-link>
                    <b-link>#lofsz </b-link>
                    <b-link>#lofaasz </b-link>
                    <b-link>#lofaaasz </b-link>
                </div>
            </div>
        </div>
        <div v-if="!user.isUsernameSet" id="register">
            <b-card title="Get started...">
                <register-form/>
            </b-card>
        </div>
        <div id="tutterFooter" class="text-center">
            Carefully crafted for
            <b-link href="https://pproj.net">PP 2023</b-link>
            <br>
            <small>
                <b-link href="/api">API Docs</b-link>
            </small>
        </div>
    </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
    name: "TutterSidebar",
    components: {RegisterForm},
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },

}
</script>

<style scoped>
div#tutterFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: -10;
}
</style>