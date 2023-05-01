<template>
    <main v-if="authorExists === true" >
        <div class="my-5">
            <h1 class="d-inline-block">@{{ authorData.name }}</h1>&nbsp;<!-- this is needed, so it's easier to highlight the name -->
            <b-badge v-if="thisIsMe" class="align-top">That's you!</b-badge>
        </div>
        <div class="my-5" v-if="thisIsMe && !livingInPast">
            <new-post/>
        </div>
        <b-alert :show="livingInPast" variant="warning" class="veryOldPostWarning">
            You are currently viewing very old posts!
        </b-alert>
        <posts :filters="{'author_id': authorId}" :older-than="olderThanId" @olderRequested="onOlderRequested" @recentRequested="onRecentRequested" />
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
import NewPost from "@/components/NewPost.vue";
import {useUserStore} from "@/stores/user";

function isValidId(value) { // returns true if value is int (or a string that could be cast to int) and it is >=1
    const parsed = parseInt(Number(value))
    return !isNaN(value) &&
        (parsed === value || String(parsed) === value) &&
        !isNaN(parseInt(value, 10)) &&
        parsed >= 1
}

export default {
    name: "AuthorView",
    components: {NewPost, Posts, NotFoundArt},
    data() {
        return {
            authorExists: null,
            authorId: this.$route.params.id,
            authorData: {
                "id": null,
                "first_seen": null,
                "name": null
            }
        }
    },
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },
    mounted() {

        if (this.authorId !== undefined && isValidId(this.authorId)) {
            this.$api.get("author/" + this.authorId, {params: {fill: false}}).then((resp) => {
                if (resp.status === 200) {
                    this.authorData = resp.data
                    this.authorExists = true
                } else {
                    this.$showToast(`Unexpected status: ${resp.status} ${resp.statusText}`)
                }
            }).catch((err) => {
                if (err.code === "ERR_BAD_REQUEST" && err.response.status === 404) {
                    this.authorExists = false
                } else {
                    this.$showToast(err.message)
                }
            })
        } else if (this.$route.query.n !== undefined) {
            const nameToLookup = this.$route.query.n
            this.$api.get("author", {params: {name: nameToLookup}}).then((resp) => {
                if (resp.status === 200) {

                    if (resp.data.length !== 1) {
                        this.authorExists = false
                        return
                    }

                    this.authorData = resp.data[0]
                    this.authorExists = true
                } else {
                    this.$showToast(`Unexpected status: ${resp.status} ${resp.statusText}`)
                }
            }).catch((err) => {
                if (err.code === "ERR_BAD_REQUEST" && err.response.status === 404) {
                    this.authorExists = false
                } else {
                    this.$showToast(err.message)
                }
            })
        } else {
            this.$router.replace({name: 'home'}) // give up
        }
    },
    methods: {
        onOlderRequested(olderThanId) {
            this.$router.push({name: 'author', params: { id: this.authorId }, query: { olderThan: olderThanId }})
        },
        onRecentRequested() {
            this.$router.push({name: 'author', params: { id: this.authorId }})
        }
    },
    computed: {
        thisIsMe() {
            return this.authorData.name === this.user.username
        },
        olderThanId() {
            if (this.$route.query.olderThan === undefined) {
                return null
            } else {
                return parseInt(this.$route.query.olderThan, 10)
            }
        },
        livingInPast() {
            return this.olderThanId !== null
        }
    }
}
</script>
