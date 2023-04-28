<template>
    <div id="postsHolder">
        <b-card class="my-3" v-for="post in posts" :key="post.id">
            <template #header>
                <b-link class="postAuthor" :to="{name: 'author', params: { id: post.author.id }}">@{{ post.author.name }}</b-link>
                <span class="text-muted float-right">{{ post.created_at | dateformat }}</span>
            </template>
            <b-card-body class="postText">
                {{ post.text }}
            </b-card-body>
        </b-card>
        <div class="my-3 text-center" v-if="loading">
            <b-spinner variant="secondary"/>
        </div>
    </div>
</template>

<script>
export default {
    name: "Posts",
    props: {
        filters: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            loading: false,
            lastId: 0,
            posts: [
                {
                    "id": 1,
                    "created_at": "2023-04-28T22:29:48.441328+02:00",
                    "text": "asd #retek",
                    "author": {"id": 1, "first_seen": "2023-04-28T22:29:48.441328+02:00", "name": "asd"},
                    "tags": ["retek"]
                },
                {
                    "id": 2,
                    "created_at": "2023-04-28T22:30:02.415037+02:00",
                    "text": "asdasdasd",
                    "author": {"id": 2, "first_seen": "2023-04-28T22:30:02.415037+02:00", "name": "asdasd"},
                    "tags": []
                },
                {
                    "id": 3,
                    "created_at": "2023-04-28T22:30:02.415037+02:00",
                    "text": "asdasdasd",
                    "author": {"id": 2, "first_seen": "2023-04-28T22:30:02.415037+02:00", "name": "asdasd"},
                    "tags": []
                },
                {
                    "id": 4,
                    "created_at": "2023-04-28T22:30:02.415037+02:00",
                    "text": "asdasdasd",
                    "author": {"id": 2, "first_seen": "2023-04-28T22:30:02.415037+02:00", "name": "asdasd"},
                    "tags": []
                }
            ]
        }
    },
    mounted() {
        this.triggerLoad().then(() => { // <- trigger initial load
            window.addEventListener('scroll', this.onScroll)
        })
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll)
    },
    filters: {
        dateformat(value) {
            if (value) {
                return (new Date(value)).toLocaleString("HU-hu")
            } else {
                return ""
            }
        }
    },
    methods: {
        onScroll() {
            const remaining = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.documentElement.clientHeight)
            if (remaining < 50 && !this.loading) {
                this.triggerLoad()
            }
        },
        triggerLoad() {
            return new Promise((resolve) => {
                if (this.loading) {
                    resolve()
                    return
                }
                this.loading = true
                this.posts.push(
                    ...this.posts
                )
                this.loading = false
                resolve()
            })
        },
        cleanup() {
            // TODO: Figure out out of focus posts
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