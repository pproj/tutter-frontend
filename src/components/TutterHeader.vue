<template>
    <b-container>
        <b-modal id="registerModal" title="Get started..." hide-footer>
            <register-form @registered="onRegistered" />
        </b-modal>
        <b-row>
            <b-col class="my-2">
                <b-link :to="{ name: 'home' }">
                    <img src="@/assets/tutter_with_text.svg" alt="Tutter logo" height="50px"/>
                </b-link>
            </b-col>
            <b-col v-if="user.isUsernameSet" class="align-self-center text-right">
                <b>@{{ user.username }}</b>
            </b-col>
            <b-col v-else-if="registerAllowed" class="align-self-center text-right">
                <b-link @click="onRegisterClicked"><b>Register!</b></b-link>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="my-2">
                <div class="w-100 text-wrap text-justify">
                    <template v-for="tag in trendingTags"><b-link :key="tag" :to="{name: 'tag', params: {tag}}" class="asd">#{{ tag }}</b-link>{{ ' ' }}</template>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {useUserStore} from "@/stores/user";
import RegisterCard from "@/components/RegisterForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
    name: "TutterHeader",
    components: {RegisterForm, RegisterCard},
    props: {
        registerAllowed: {
            type: Boolean,
            default: true
        },
        trendingTags: {
            type: Array,
            required: true
        }
    },
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },
    methods: {
        onRegisterClicked() {
            if (!this.user.isUsernameSet && this.registerAllowed) {
                this.$bvModal.show("registerModal")
            }
        },
        onRegistered() {
            this.$bvModal.hide("registerModal")
        }
    }
}
</script>

<style scoped>

</style>