<template>
    <main v-if="authorExists === true" >
        <div class="my-5">
            <h1>@{{ authorData.name }}</h1>
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

export default {
    name: "AuthorView",
    components: {Posts, NotFoundArt},
    data() {
        return {
            authorExists: null,
            authorId: null,
            authorData: {
                "id": null,
                "first_seen": null,
                "name": null
            }
        }
    }
}
</script>
