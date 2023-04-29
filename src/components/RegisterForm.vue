<template>

    <b-form>
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
            ></b-form-input>
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
            usernameInput: ""
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
