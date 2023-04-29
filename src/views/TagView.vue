<template>
    <main v-if="tagExists === true" >
        <div class="my-5">
            <h1>#{{ tagData.tag }}</h1>
        </div>
        <posts :filters="{'tag': tag}" />
    </main>
    <main v-else-if="tagExists === false" class="loweredMain">
        <not-found-art text="It seems like no one used this tag before"/>
    </main>
    <main v-else class="loweredMain text-center">
        <b-spinner />
    </main>
</template>

<script>
import Posts from "@/components/Posts.vue";
import NotFoundArt from "@/components/NotFoundArt.vue";

export default {
    name: "TagView",
    components: {Posts, NotFoundArt},
    data() {
        return {
            tagExists: null,
            tag: this.$route.params.tag,
            tagData: {
                "first_seen": null,
                "tag": null
            }
        }
    },
    mounted() {
        this.$api.get("tag/" + this.tag, { params: { fill: false } }).then((resp) => {
            if (resp.status === 200) {
                this.tagData = resp.data
                this.tagExists = true
            } else {
                this.$showToast(`Unexpected status: ${resp.status} ${resp.statusText}`)
            }
        }).catch((err) => {
            if (err.code === "ERR_BAD_REQUEST" && err.response.status === 404) {
                this.tagExists = false
            } else {
                this.$showToast(err.message)
            }
        })
    }
}
</script>
