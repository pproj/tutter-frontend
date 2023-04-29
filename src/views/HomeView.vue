<template>
    <main>
        <div class="my-5" v-if="!livingInPast">
            <new-post/>
        </div>
        <b-alert :show="livingInPast" variant="warning" class="veryOldPostWarning">
            You are currently viewing very old posts!
        </b-alert>
        <posts :older-than="olderThanId" @olderRequested="onOlderRequested" @recentRequested="onRecentRequested"/>
    </main>
</template>


<script>
import Posts from "@/components/Posts.vue";
import NewPost from "@/components/NewPost.vue";

export default {
    name: "HomeView",
    components: {Posts, NewPost},
    methods: {
        onOlderRequested(olderThanId) {
            this.$router.push({name: 'home', query: { olderThan: olderThanId }})
        },
        onRecentRequested() {
            this.$router.push({name: 'home'})
        }
    },
    computed: {
        olderThanId() {
            if (this.$route.query.olderThan === undefined) {
                return null
            } else {
                return parseInt(this.$route.query.olderThan, 10)
            }
        },
        livingInPast() {
            return this.olderThanId !== null
        }
    }
}
</script>

<style scoped>

</style>
