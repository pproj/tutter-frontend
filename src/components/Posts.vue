<template>
    <div>
        <div class="my-3 text-center" v-if="livingInPast">
            <b-button block variant="primary" @click="onBackToTheFutureClicked">Back to the future!</b-button>
        </div>
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
        <div class="my-3 text-center" v-if="!reachedOldest && !shouldAutoLoadMore">
            <b-button block variant="primary" @click="onLoadOlderClicked">Load older posts</b-button>
        </div>
        <div class="my-3 text-center" v-if="reachedOldest">
            <span class="text-muted">You are at the beginning of the time, universe and everything...</span>
        </div>
    </div>
</template>

<script>

const BATCH_SIZE = 25

export default {
    name: "Posts",
    props: {
        filters: {
            type: Object,
            default() {
                return {}
            }
        },
        olderThan: {
            type: Number,
            default: null
        },
        maxPosts: {
            type: Number,
            default: 250
        }
    },
    data() {
        return {
            lastScrollTop: 0,
            loading: true,
            lastId: this.olderThan || null, // <- initial value
            posts: [],
            reachedOldest: false
        }
    },
    mounted() {
        this.triggerLoad(true).then(() => { // <- trigger initial load
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
            if (this.lastScrollTop > document.documentElement.scrollTop) {
                return // the user is going upstairs...
            }
            this.lastScrollTop = document.documentElement.scrollTop

            // The user is going downstairs, may trigger load now...
            const remainingPx = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.documentElement.clientHeight)
            if (remainingPx < 100 && !this.loading && this.shouldAutoLoadMore) {
                this.triggerLoad()
            }
        },
        triggerLoad(force = false) {
            return new Promise((resolve) => {
                if (!force) {
                    if (this.loading || !this.shouldAutoLoadMore) {
                        resolve()
                        return
                    }
                }
                this.loading = true

                // compile params
                let params = Object.assign({}, this.filters) // this is a shallow copy

                if (this.lastId !== null) {
                    params['before_id'] = this.lastId
                }

                params['limit'] = BATCH_SIZE
                params['order'] = 'desc'

                this.$api.get("post",{params: params}).then((resp) => {

                    if (resp.status !== 200) {
                        this.$showToast(`Unexpected status: ${resp.status} ${resp.statusText}`)
                        return
                    }

                    if (resp.data.length > 0) {

                        this.posts.push(...resp.data)

                        // store "oldest" id ever seen
                        let smallestId = +Infinity
                        resp.data.forEach((p) => {
                            if (p.id < smallestId) {
                                smallestId = p.id
                            }
                        })
                        if (this.lastId === null || smallestId < this.lastId) {
                            this.lastId = smallestId
                        }

                    }

                    if (resp.data.length < BATCH_SIZE) {
                        this.reachedOldest = true
                    }

                    // done \o/
                    this.loading = false
                    resolve()
                }).catch((err) => {
                    this.$showToast(err.message)
                })
            })
        },
        cleanup() {
            // TODO: Figure out out of focus posts
            // TODO: Remove old posts not in focus
            // TODO: Clear reachedOldest
        },
        onLoadOlderClicked() {
            this.$emit("olderRequested", this.lastId)
        },
        onBackToTheFutureClicked() {
            this.$emit("recentRequested")
        },
        restart() {
            this.loading = true
            window.removeEventListener('scroll', this.onScroll)
            window.scrollTo(0,0) // go upstairs
            this.lastScrollTop = 0
            this.posts = []
            this.lastId = this.olderThan || null
            this.reachedOldest = false
            this.triggerLoad(true).then(() => { // <- trigger initial load
                window.addEventListener('scroll', this.onScroll)
            })
        }
    },
    computed: {
        shouldAutoLoadMore() {
            return this.posts.length < this.maxPosts && !this.reachedOldest
        },
        livingInPast() {
            return this.olderThan !== null
        }
    },
    watch: {
        filters: {
            deep: true,
            handler() {
                this.restart()
            }
        },
        olderThan() {
            this.restart()
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