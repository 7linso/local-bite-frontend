import { api } from "@/services/api"

export const auth = {
    signup: (payload: {
        fullname: string
        username: string
        email: string
        password: string
    }) => {
        return api("/auth/signup", {
            method: "POST",
            body: JSON.stringify(payload),
        })
    },

    signin: (payload: { identifier: string; password: string }) => {
        return api("/auth/signin", {
            method: "POST",
            body: JSON.stringify(payload),
        })
    },

    signout: () => {
        return api("/auth/signout", {
            method: "POST",
        })
    },

    me: () => {
        return api("/auth/me", {
            method: "GET"
        })
    }
}
