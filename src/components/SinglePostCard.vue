<template>
    <b-card :class="cardClass">
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
        },
        animate: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isVerfied() {
            return this.postData.text.toLowerCase().includes("covfefe") // might not be the best idea
        },
        cardClass() {
            if (this.animate) {
                return "fade-in"
            } else {
                return ""
            }
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
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: scale(0,0);
    }
    75% {
        transform: scale(1.02,1.02);
    }
    100% {
        opacity: 1;
        transform: scale(1,1);
    }
}
.fade-in {
    animation: fadeIn 0.5s;
}
</style>