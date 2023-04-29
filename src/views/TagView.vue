<template>
    <main v-if="tagExists === true" >
        <div class="my-5">
            <h1>#{{ tagData.name }}</h1>
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
        // TODO: check if tag exists
        // TODO: if yes, start fetching posts
    }
}
</script>
