import {defineStore} from 'pinia'

const TUTTER_USERNAME_KEY = "TUTTER_USERNAME"
export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        username: localStorage.getItem(TUTTER_USERNAME_KEY) || ""
    }),
    getters: {
        isUsernameSet: (state) => state.username !== ""
    },
    actions: {
        setUsername(username) {
            localStorage.setItem(TUTTER_USERNAME_KEY, username)
            this.username = username
        }
    }
})
