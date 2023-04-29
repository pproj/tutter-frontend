<template>
    <main v-if="authorExists === true" >
        <div class="my-5">
            <h1>@{{ authorData.name }}</h1>
        </div>
        <div class="my-5" v-if="thisIsMe">
            <new-post/>
        </div>
        <posts :filters="{'author_id': authorId}" />
    </main>
    <main v-else-if="authorExists === false" class="loweredMain">
        <not-found-art text="It seems like this author does not exists"/>
    </main>
    <main v-else class="loweredMain text-center">
        <b-spinner />
    </main>
</template>

<script>
import Posts from "@/components/Posts.vue";
import NotFoundArt from "@/components/NotFoundArt.vue";
import NewPost from "@/components/NewPost.vue";
import {useUserStore} from "@/stores/user";

export default {
    name: "AuthorView",
    components: {NewPost, Posts, NotFoundArt},
    data() {
        return {
            authorExists: null,
            authorId: this.$route.params.id,
            authorData: {
                "id": null,
                "first_seen": null,
                "name": null
            }
        }
    },
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },
    mounted() {
        this.$api.get("author/" + this.authorId, { params: { fill: false } }).then((resp) => {
            if (resp.status === 200) {
                this.authorData = resp.data
                this.authorExists = true
            } else {
                this.$showToast(`Unexpected status: ${resp.status} ${resp.statusText}`)
            }
        }).catch((err) => {
            if (err.code === "ERR_BAD_REQUEST" && err.response.status === 404) {
                this.authorExists = false
            } else {
                this.$showToast(err.message)
            }
        })
    },
    computed: {
        thisIsMe() {
            return this.authorData.name === this.user.username
        }
    }
}
</script>
