<template>
    <b-card>
        <template #header>
            <b-link class="postAuthor" :to="{name: 'author', params: { id: postData.author.id }}">@{{ postData.author.name }}</b-link><img v-if="isVerfied" src="@/assets/verified.svg" class="verifiedBadge align-self-center">
            <span class="text-muted float-right">{{ postData.created_at | dateformat }}</span>
        </template>
        <b-card-body class="postText">
            {{ postData.text }}
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    name: "SinglePostCard",
    props: {
        postData: {
            type: Object,
            required: true
        }
    },
    computed: {
        isVerfied() {
            return this.postData.text.toLowerCase().includes("covfefe") // might not be the best idea
        }
    },
    filters: {
        dateformat(value) {
            if (value) {
                return (new Date(value)).toLocaleString("HU-hu")
            } else {
                return ""
            }
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

img.verifiedBadge {
    height: 1rem;
    padding-left: 0.2rem;
}
</style>