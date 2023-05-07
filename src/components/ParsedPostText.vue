<template>
    <article v-if="!processCompleted">{{ postText }}</article>
    <article v-else>
        <template v-for="(token, idx) in tokens">
            <span :key="idx" v-if="token.type === 'text'">{{ token.text }}</span>
            <b-link :key="idx" v-else-if="token.type === 'hyperlink'" :href="token.value">{{ token.text }}</b-link>
            <b-link :key="idx" v-else-if="token.type === 'tag'" :to="{name: 'tag', params: {tag: token.value}}">{{ token.text }}</b-link>
            <b-link :key="idx" v-else-if="token.type === 'author'" :to="{name: 'author', query: {n: token.value}}">{{ token.text }}</b-link> <!-- We would need backend support for that -->
            <br :key="idx" v-else-if="token.type === 'newline'"/>
        </template>
    </article>
</template>

<script>

const TAG_REGEXP = /#[a-zA-Z0-9]+/g // copied from backend
const AUTHOR_REGEXP = /@[a-z0-9_]+/g // copied, but modified from backend
const HYPERLINK_REGEXP = /(?<=^|\s)(?:((?:https?|ftp):\/\/)?(?:[a-z0-9A-Z]{1}(?:[a-z0-9A-Z\-]*[a-z0-9A-Z]{1})?\.)+[a-z]{2,}(?:\/[^\s]*)?)(?=\s|$)/g // handcrafted with utmost care (used this as a starting point: https://stackoverflow.com/a/48769624)
const REGEXP_MATCHERS = {
    "tag": TAG_REGEXP,
    "author": AUTHOR_REGEXP,
    "hyperlink": HYPERLINK_REGEXP
}


export default {
    name: "ParsedPostText",
    props: {
        postText: {
            type: String,
            required: true
        },
        expectedTags: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            processCompleted: false,
            tokens: []
        }
    },
    created() {
        // Since this is a taxing operation, and the postText should never change we do everything here, only once
        this.processText().then(() => {
            this.processCompleted = true
        })
    },
    methods: {
        processText() {
            return new Promise((resolve) => {
                let workText = this.postText

                let matches = []
                let identifiedAuthors = []

                Object.keys(REGEXP_MATCHERS).forEach((k) => {
                    const r = REGEXP_MATCHERS[k]
                    for (const m of workText.matchAll(r)) {

                        if (k === "tag") {
                            if (!this.expectedTags.includes(m[0].slice(1))) {
                                // If the backed does not agree that this is tag is in the post, we just ignore it
                                continue
                            }
                        }

                        if (k === "author") {
                            identifiedAuthors.push(m[0].slice(1))
                        }

                        matches.push({
                            type: k,
                            match: m
                        })
                    }
                })

                this.$emit("authorsIdentified", identifiedAuthors)

                // It would be overkill to use regexp to match newlines
                let i = -1
                while ((i = workText.indexOf('\n', i + 1)) !== -1) {
                    matches.push({
                        type: "newline",
                        match: {
                            index: i,
                            0: "\n"
                        }
                    })
                }

                matches.sort((a, b) => a.match.index - b.match.index)

                // we have all matches in ascending order now, it's time to chop up the text to tokens
                let finalTokens = [] // we put them here, to not trigger vue stuff while working
                let idx = 0
                matches.forEach((m) => {
                    const tokenTextBefore = workText.slice(idx, m.match.index)
                    if (tokenTextBefore !== "") {
                        finalTokens.push({
                            type: "text",
                            text: tokenTextBefore
                        })
                    }

                    let token = {
                        type: m.type
                    }

                    const tokenText = m.match[0]

                    switch (token.type) { // include text for these tokens only
                        case "text":
                        case "tag":
                        case "author":
                        case "hyperlink":
                            token.text = tokenText
                            break;
                    }

                    switch (token.type) { // these tokens may require a value token
                        case "author":
                        case "tag":
                            token.value = tokenText.slice(1) // remove hashmark or @ sign
                            break;
                        case "hyperlink":
                            if (m.match[1] === undefined) { // missing protocol
                                token.value = "https://" + tokenText
                            } else {
                                token.value = tokenText
                            }
                            break;
                    }

                    finalTokens.push(token)

                    idx = m.match.index + m.match[0].length
                })
                const remainderText = workText.slice(idx, workText.length)
                if (remainderText !== "") {
                    finalTokens.push({
                        type: "text",
                        text: remainderText
                    })
                }

                this.tokens = finalTokens // trigger vue thingy only once
                resolve() // aaaaand we are done \o/

            })
        }
    }
}
</script>


<style scoped>

</style>