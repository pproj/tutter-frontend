<template>
    <div>
        <b-card class="my-3">
            <template #header>
                <b-link class="postAuthor">@marcsello</b-link>
                <span class="text-muted float-right">2023. 23. 23 12:20:00</span>
            </template>
            <b-card-body class="postText">
                This is an example
                <b-link>#tutt</b-link>
            </b-card-body>
        </b-card>
        <b-card class="my-3">
            <template #header>
                <b-link class="postAuthor">@asdasdasd</b-link>
                <span class="text-muted float-right">2023. 23. 23 12:20:00</span>
            </template>
            <b-card-body class="postText">
                Hello world
                <b-link>#tutt</b-link>
            </b-card-body>
        </b-card>
        <b-card class="my-3" bg-variant="warning">
            <template #header>
                <b-link class="postAuthor">@asdasdasd</b-link>
                <span class="text-muted float-right">2023. 23. 23 12:20:00</span>
            </template>
            <b-card-body class="postText">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu mollis tortor. Aliquam dapibus dui et nibh convallis blandit. Donec condimentum purus id ex.
            </b-card-body>
        </b-card>
        <div class="my-3 text-center">
            <b-spinner  variant="secondary" />
        </div>
    </div>
</template>

<script>
export default {
    name: "Posts",
    props: {
        filters: {
            type: Object,
            default: {}
        }
    }
}
</script>

<style scoped>
.postText {
    font-size: 1.15em;
}
.postAuthor {
    font-weight: bold;
    /* text-decoration: underline; */
    color: black;
}
</style>