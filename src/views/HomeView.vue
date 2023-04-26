<template>
    <main>
        <div class="my-5">
            <b-form>
                <b-form-group id="create-new-post-textarea-group">
                    <b-textarea id="create-new-post-textarea" placeholder="What's on your mind...?"></b-textarea>
                </b-form-group>

                <div class="text-right">
                    <span class="text-muted mx-2">0/160</span>&nbsp;<b-button variant="primary">Post</b-button>
                </div>

            </b-form>
        </div>
        <posts/>
    </main>
</template>


<script setup>
import Posts from "@/components/Posts.vue";
</script>

<style scoped>
#create-new-post-textarea {
    font-size: 1.15em;
}
</style>
