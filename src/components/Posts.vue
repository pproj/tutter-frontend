<template>
    <div>
        <div class="my-3 text-center" v-if="livingInPast">
            <b-button block variant="primary" @click="onBackToTheFutureClicked">Back to the future!</b-button>
        </div>
        <single-post-card
            class="my-3"
            v-for="post in posts"
            :key="post.id"
            :post-data="post"
            :animate="post._meta !== undefined && post._meta.animate"
        />
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

import SinglePostCard from "@/components/SinglePostCard.vue";

const BATCH_SIZE = 25

export default {
    name: "Posts",
    components: {SinglePostCard},
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
            firstId: null, // <- first as in at the top of the page; used for polling
            lastId: this.olderThan || null, // last as in bottom of the page; used for scrolling
            posts: [],
            reachedOldest: false,
            pollRestartTimeout: null,
            pollAbortController: null,
            // cleanup job state
            scrolledUp: true,
            scrolledUpSince: new Date(),
            cleanupInterval: null
        }
    },
    mounted() {
        this.triggerLoad(true).then(() => { // <- trigger initial load
            if (this.posts.length > 0) { // should only return empty if there are absolutely no posts
                this.firstId = this.posts[0].id
            }
            if (!this.livingInPast) {
                this.startPolling()
            }
            window.addEventListener('scroll', this.onScroll)
        })
        this.cleanupInterval = setInterval(this.runCleanup, 10000)
    },
    beforeDestroy() {
        if (!this.livingInPast) {
            this.stopPolling()
        }
        window.removeEventListener('scroll', this.onScroll)
        if (this.cleanupInterval !== null) {
            clearInterval(this.cleanupInterval)
        }
    },
    methods: {
        startPolling() {
            // Note: Restarts should always use timeout, to prevent flooding the server with requests

            // compile params
            let params = Object.assign({}, this.filters) // this is a shallow copy
            if (this.firstId === null) {
                console.warn("no posts loaded at the beginning of listen, WILL MISS a few posts!")
            } else {
                params['last'] = this.firstId
            }

            /*
                the following is another ugly hack:
                If we could not determine the "last" parameter for the query and the poll times out,
                we restart it quicker to lower the chance of missing a post

                it is still possible to miss a post tho
             */
            const quickRetryHack = this.firstId === null // <- enable quick retry hack

            // Start request
            this.pollAbortController = new AbortController()
            this.$api.get("poll", {params: params, signal: this.pollAbortController.signal}).then((resp) => {

                // return if we don't need to do anything
                if (resp.status === 204) { // poll time expired, no new posts received
                    this.pollRestartTimeout = setTimeout(this.startPolling, quickRetryHack ? 0 : 2000) // if quick retry hack enabled, restart the poll quicker (set timeout with 0 as timeout is valid actually)
                    return
                } else if (resp.status !== 200) {
                    this.pollRestartTimeout = setTimeout(this.startPolling, 5000)
                    return
                }
                if (resp.data.length === 0) { // this is actually a bug in the backend, whatever...
                    this.pollRestartTimeout = setTimeout(this.startPolling, 5000)
                    return
                }

                // record current scroll positions
                const scrollHeightBefore = document.documentElement.scrollHeight
                const scrollTopBefore = document.documentElement.scrollTop

                // push new posts at the top
                let newPosts = [...resp.data] // shallow copy
                newPosts = newPosts.map(p => ({...p, _meta: {animate: true}})) // this is a real-time post, we should animate it
                newPosts.sort((a, b) => b.id - a.id) // desc
                this.posts.unshift(...newPosts)

                // keep scroll hack
                /*
                    This is yet another ugly hack, if inserting a new post causes the view to be scrolled*,
                    we quickly scroll it back, so it may appear that the posts stayed in place.

                    *Yes, sometimes the browser does this scroll for us, in these cases, we shouldn't double-scroll

                    +/- 1px shift may still happen due to some weird web reason, but that's not that disturbing
                 */
                if (document.documentElement.scrollTop > document.documentElement.clientHeight * 0.75) { // <- only do this if we are already scrolled
                    // well, this is a hack, it lets the view scroll past, then scrolls it back... it happens real quick, so the user shouldn't notice
                    this.$nextTick(() => {
                        const autoScrolled = document.documentElement.scrollTop - scrollTopBefore // sometimes the browser does this for us
                        const shouldScroll = (document.documentElement.scrollHeight - scrollHeightBefore) - autoScrolled
                        if (Math.abs(shouldScroll) > 1) {
                            const newScrollTop = document.documentElement.scrollTop + shouldScroll
                            // If the following does not work, change it to another one:
                            //document.documentElement.scrollTop = newScrollTop
                            //window.scrollY = newScrollTop
                            window.scrollTo({
                                top: newScrollTop,
                                behavior: "instant"
                            })
                        }
                    })
                }

                // update first id
                if (this.firstId < newPosts[0].id) {
                    this.firstId = newPosts[0].id // hopefully this won't set a wrong value
                }

                // done
                this.pollRestartTimeout = setTimeout(this.startPolling, 500) // 0.5sec

            }).catch((err) => {
                if (err.code === "ERR_CANCELED") {
                    // stopPolling is used
                    return
                }
                console.error(err)
                this.pollRestartTimeout = setTimeout(this.startPolling, 5000) // 5sec
            })
        },
        stopPolling() {
            clearTimeout(this.pollRestartTimeout) // <- this literally takes anything and does not cause any problem
            if (this.pollAbortController !== null) {
                this.pollAbortController.abort()
            }
        },
        onScroll() {
            const dir = document.documentElement.scrollTop - this.lastScrollTop
            this.lastScrollTop = document.documentElement.scrollTop
            if (dir < 0) {
                // the user is going upstairs...
                if (document.documentElement.scrollTop < document.documentElement.clientHeight*1.2) {
                    // at the "top"
                    if (!this.scrolledUp) {
                        this.lastScrollTop = new Date()
                        this.scrolledUp = true
                    }
                }
            } else {
                // The user is going downstairs, may trigger load now...
                const remainingPx = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.documentElement.clientHeight)
                if (remainingPx < 100 && !this.loading && this.shouldAutoLoadMore) {
                    this.triggerLoad()
                }
                if (document.documentElement.scrollTop >= document.documentElement.clientHeight*1.2) {
                    // left the top
                    this.scrolledUp = false
                }
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

                this.$api.get("post", {params: params}).then((resp) => {

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
        runCleanup() {
            if (!this.scrolledUp) {
                return
            }
            const beenUpThereSince = (new Date()) - this.scrolledUpSince // returns milliseconds
            if (beenUpThereSince < 7000) {
                return
            }


            const postsToRemove = this.posts.length - BATCH_SIZE // keep one batch loaded only
            if (postsToRemove <= 0) {
              return;
            }

            // time to cleanup...
            this.posts.splice(-postsToRemove)

            // update scroll vars to fix scrolling
            this.reachedOldest = false // can not possibly have reached the oldest if there are posts to be removed
            // also the last id have to be updated as well
            let smallestId = +Infinity
            this.posts.forEach((p) => {
              if (p.id < smallestId) {
                smallestId = p.id
              }
            })
            this.lastId = smallestId

        },
        onLoadOlderClicked() {
            this.$emit("olderRequested", this.lastId)
        },
        onBackToTheFutureClicked() {
            this.$emit("recentRequested")
        },
        restart() {
            this.loading = true

            // unregister everything
            if (!this.livingInPast) {
                this.stopPolling()
            }
            window.removeEventListener('scroll', this.onScroll)

            if (this.cleanupInterval !== null) {
                clearInterval(this.cleanupInterval)
            }

            // scroll up
            window.scrollTo(0, 0) // go upstairs

            // reset vals
            this.lastScrollTop = 0
            this.posts = []
            this.firstId = null
            this.lastId = this.olderThan || null
            this.reachedOldest = false
            this.scrolledUp = true
            this.scrolledUpSince = new Date()

            // re-register stuff
            this.triggerLoad(true).then(() => { // <- trigger initial load
                if (this.posts.length > 0) { // should only return empty if there are absolutely no posts
                    this.firstId = this.posts[0].id
                }
                if (!this.livingInPast) {
                    this.startPolling()
                }
                window.addEventListener('scroll', this.onScroll)
            })
            this.cleanupInterval = setInterval(this.runCleanup, 10000)
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