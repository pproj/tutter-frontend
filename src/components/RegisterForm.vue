<template>

    <b-form @submit.prevent="setUsername">
        <b-form-group
                id="input-group-username"
                label="Username:"
                label-for="input-username"
                description=""
        >
            <b-form-input
                    id="input-username"
                    type="text"
                    v-model="usernameInput"
                    placeholder="Anonymous"
                    maxlength="32"
                    required
                    :state="feedback"
                    @change="onChange"
                    @input="onInput"
            ></b-form-input>
            <b-form-invalid-feedback :state="feedback">
                Must be maximum 32 characters and can contain only the following characters: a-z, 0-9, and _
            </b-form-invalid-feedback>
        </b-form-group>
        <b-button variant="success" size="sm" class="float-right" :disabled="!usernameValid" @click="setUsername">
            Register!
        </b-button>
    </b-form>

</template>

<script>
import {useUserStore} from "@/stores/user";


export default {
    name: "RegisterForm",
    data() {
        return {
            usernameInput: "",
            feedback: null
        }
    },
    setup() { // bele kéne szarni az egészbe...
        return {user: useUserStore()}
    },
    methods: {
        setUsername() {
            if (this.usernameValid) {
                this.user.setUsername(this.usernameInput)
                this.$emit("registered", this.user.username)
                this.$showToast(`Hello ${this.usernameInput}! Welcome to Tutter!`, 'success', 'Registered', false)
            }
        },
        onChange() {
            this.feedback = this.usernameValid
        },
        onInput() {
            if (this.feedback !== null) {
                this.feedback = this.usernameValid
            }
        }
    },
    computed: {
        usernameValid() {
            if (this.usernameInput.length > 0 && this.usernameInput.length <= 32) {
                return /^[a-z0-9_]+$/.test(this.usernameInput)
            } else {
                return false
            }
        }
    }

}
</script>
