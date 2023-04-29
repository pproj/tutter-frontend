<template>
    <b-container>
        <b-row>
            <b-col class="my-2">
                <b-link :to="{ name: 'home' }">
                    <img src="@/assets/tutter_with_text.svg" alt="Tutter logo" height="50px"/>
                </b-link>
            </b-col>
            <b-col v-if="user.isUsernameSet" class="align-self-center text-right">
                <b>@{{ user.username }}</b>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="my-2">
                <div class="w-100 text-wrap text-justify">
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
                    <b-link>#lofasz </b-link>
                    <b-link>#lofas </b-link>
                    <b-link>#lof </b-link>
                    <b-link>#lofsz </b-link>
                    <b-link>#lofaasz </b-link>
                    <b-link>#lofaaasz </b-link>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {useUserStore} from "@/stores/user";

export default {
    name: "TutterHeader",
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },
}
</script>

<style scoped>

</style>