<template>
    <b-card :class="{'fade-in' : animate, 'centrifuge': isWashingMachine, 'rofl-copter': isRoflCopter}"
            :border-variant="cardVariant"
            :header-border-variant="cardVariant"
            v-b-hover="handleCardHover"
    >
        <template #header>
            <b-icon icon="exclamation-triangle-fill" variant="warning" class="mr-2" v-if="isWarning"/>
            <b-link
                    class="postAuthor"
                    :to="{name: 'author', params: { id: postData.author.id }}">@{{ postData.author.name }}</b-link>
            <img
                v-if="isVerfied"
                src="@/assets/verified.svg"
                class="verifiedBadge align-self-center"
                alt="Verified badge"
                title="This is a verified user"
            />
            <span class="text-muted float-right">
                <b-link
                    variant="link"
                    v-if="allowPermalink"
                    v-show="hovered"
                    :to="{name: 'post', params: {id: postData.id}}"
                    title="Permalink"
                >
                    <b-icon icon="link45deg" />
                </b-link>
                {{ postData.created_at | dateformat }}
            </span>
        </template>
        <b-card-body class="postText">
            <parsed-post-text
                @authorsIdentified="onAuthorsIdentified"
                :post-text="postData.text"
                :expected-tags="postData.tags"
            />
        </b-card-body>
    </b-card>
</template>

<script>
import ParsedPostText from "@/components/ParsedPostText.vue";
import {useUserStore} from "@/stores/user";

export default {
    name: "SinglePostCard",
    components: {ParsedPostText},
    props: {
        postData: {
            type: Object,
            required: true
        },
        animate: {
            type: Boolean,
            default: false
        },
        allowPermalink: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            hovered: false,
            authorsIdentified: []
        }
    },
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },
    computed: {
        // Easter eggs:
        isVerfied() {
            return this.postData.text.toLowerCase().includes("covfefe") // might not be the best idea
        },
        isWarning() {
            return this.postData.tags.includes('important')
        },
        isWashingMachine() {
            return this.postData.tags.includes('washingmachine') || this.postData.text.toLowerCase().includes('brrr')
        },
        isRoflCopter() {
            return this.postData.tags.includes('roflcopter')
        },
        isToMe() {
            if (!this.user.isUsernameSet) {
                return false
            }
            return this.authorsIdentified.includes(this.user.username)
        },
        cardVariant() {
            if (this.isWarning) {
                return "warning"
            }
            if (this.isToMe) {
                return "info"
            }
            return ""
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
    },
    methods: {
        handleCardHover(hovered) {
            this.hovered = hovered
        },
        onAuthorsIdentified(identifiedAuthors) {
            this.authorsIdentified = identifiedAuthors
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
        transform: scale(0, 0);
    }
    75% {
        transform: scale(1.02, 1.02);
    }
    100% {
        opacity: 1;
        transform: scale(1, 1);
    }
}

.fade-in {
    animation: fadeIn 0.5s;
}

@keyframes spin-shake {
    0% {
        transform: translate(7px, 2px);
    }
    33% {
        transform: translate(-7px, 2px);
    }
    66% {
        transform: translate(-7px, -2px);
    }
    100% {
        transform: translate(7px, -2px);
    }
}

.centrifuge {
    animation-name: spin-shake;
    animation-duration: 50ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes rotor {
    0% {
        transform: rotate3d(0, 1, 0, 0deg);
    }
    100% {
        transform: rotate3d(0, 1, 0, 360deg);
    }
}

.rofl-copter {
    animation-name: rotor;
    animation-duration: 500ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

</style>