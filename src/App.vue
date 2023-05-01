<template>
    <div id="app">
        <tutter-header class="d-lg-none" :register-allowed="!isPresentationMode"/>
        <b-container>
            <b-row>
                <b-col lg="3" class="bv-d-md-down-none">
                    <div id="sidebarContainer">
                        <tutter-sidebar :register-allowed="!isPresentationMode"/>
                    </div>
                </b-col>
                <b-col lg="9">
                    <router-view :key="$route.fullPath"/>
                </b-col>
            </b-row>
        </b-container>
        <transition name="toast">
            <div v-if="displayScrollToTop" id="scrollTopHolder">
                <b-button pill variant="primary" @click="onScrollToTopClicked" title="Scroll to top">
                    <b-icon icon="arrow-up"/>
                </b-button>
            </div>
        </transition>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import TutterSidebar from "@/components/TutterSidebar.vue";
import TutterHeader from "@/components/TutterHeader.vue";

export default defineComponent({
    components: {TutterHeader, TutterSidebar},
    data() {
        return {
            displayScrollToTop: false
        }
    },
    computed: {
        isPresentationMode() {
            return this.$route.name === 'presentation'
        }
    },
    mounted() {
        if (!this.isPresentationMode) {
            window.addEventListener('scroll', this.onScroll)
        }
    },
    beforeDestroy() {
        if (!this.isPresentationMode) {
            window.removeEventListener('scroll', this.onScroll)
        }
    },
    methods: {
        onScroll() {
            if (this.isPresentationMode) {
                return
            }
            const shouldDisplayScrollToTop = document.documentElement.scrollTop > (document.documentElement.clientHeight * 1.2)

            if (shouldDisplayScrollToTop !== this.displayScrollToTop) { // we don't want to trigger that many vue update stuff
                this.displayScrollToTop = shouldDisplayScrollToTop
            }
        },
        onScrollToTopClicked() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    }
})
</script>

<style scoped>
div#sidebarContainer {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
}

div#scrollTopHolder {
    position: fixed;
    bottom: 30px;
    right: 30px;
}

@keyframes toast {
    from {
        transform: translate(0, 100px);
    }
    75% {
        transform: translate(0, -10px);
    }
    to {
        transform: translate(0, 0);
    }
}

.toast-enter-active {
    animation: toast 0.5s;
}

.toast-leave-active {
    animation: toast 0.3s;
    animation-direction: reverse;
}

.toast-enter-from,
.toast-leave-to {
    transform: translate(0, 100px);
}
</style>
