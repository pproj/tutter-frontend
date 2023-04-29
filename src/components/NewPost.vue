<template>
    <b-overlay :show="postingInProgress" variant="transparent" blur="2px">
        <b-form>
            <b-form-group id="create-new-post-textarea-group">
                <b-textarea
                        id="create-new-post-textarea"
                        placeholder="What's on your mind...?"
                        v-model="newPostText"
                        :maxlength="maxLength"
                />
            </b-form-group>

            <div class="text-right">
                <span class="text-muted mx-2">{{ newPostText.length }}/{{ maxLength }}</span>&nbsp;
                <b-button variant="primary" @click="attemptPost" :disabled="!postGood">Post</b-button>
            </div>

        </b-form>
    </b-overlay>
</template>

<script>
import {useUserStore} from "@/stores/user";

export default {
    name: "NewPost",
    props: {
        maxLength: {
            type: Number,
            default: 260
        }
    },
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },
    data() {
        return {
            newPostText: "",
            postingInProgress: false
        }
    },
    methods: {
        attemptPost() {
            if (!this.postGood) {
                return
            }
            this.postingInProgress = true
            const data = {
                author: this.user.username,
                text: this.newPostText
            }
            this.$api.post("post", data).then((resp) => {
                if (resp.status === 201) {
                    this.newPostText = ""
                    this.$emit("created", resp.data)
                } else {
                    this.$showToast(`Unexpected status: ${resp.status} ${resp.statusText}`)
                }
                this.postingInProgress = false
            }).catch((err) => {
                this.$showToast(err.message)
                this.postingInProgress = false
            })
        }
    },
    computed: {
        postGood() {
            return this.newPostText.length > 0 && this.newPostText.length <= this.maxLength && !this.postingInProgress && this.user.isUsernameSet
        }
    }
}
</script>

<style scoped>
#create-new-post-textarea {
    font-size: 1.15em;
}
</style>