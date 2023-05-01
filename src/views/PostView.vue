<template>
    <main class="my-5" v-if="postExists === true" >
        <single-post-card :post-data="postData" :animate="false" :allow-permalink="false"/>
    </main>
    <main v-else-if="postExists === false" class="loweredMain">
        <not-found-art text="It seems like this post does not exists"/>
    </main>
    <main v-else class="loweredMain text-center">
        <b-spinner />
    </main>
</template>

<script>

import {defineComponent} from "vue";
import NotFoundArt from "@/components/NotFoundArt.vue";
import NewPost from "@/components/NewPost.vue";
import SinglePostCard from "@/components/SinglePostCard.vue";

export default defineComponent({
    name: "PostView",
    components: {SinglePostCard, NewPost, NotFoundArt},
    data() {
        return {
            postExists: null,
            postId: this.$route.params.id,
            postData: {}
        }
    },
    mounted() {
        this.$api.get("post/" + this.postId).then((resp) => {
            if (resp.status === 200) {
                this.postData = resp.data
                this.postExists = true
            } else {
                this.$showToast(`Unexpected status: ${resp.status} ${resp.statusText}`)
            }
        }).catch((err) => {
            if (err.code === "ERR_BAD_REQUEST" && err.response.status === 404) {
                this.postExists = false
            } else {
                this.$showToast(err.message)
            }
        })
    }
})
</script>