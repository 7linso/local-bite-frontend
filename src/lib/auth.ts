import { api } from "@/services/api"
import type { StringMappingType } from "typescript"

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

    signin: (payload: {
        identifier: string;
        password: string
    }) => {
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
    },

    updateProfilePic: (payload: {
        profilePic: string;
    }) => {
        return api("/auth/update-profile-pic", {
            method: "PATCH",
            body: JSON.stringify(payload),
        })
    },

    updateProfile: (payload: {
        fullname: String,
        username: String,
        email: String,
        bio: String
    }) => {
        return api('/auth/update-profile', {
            method: "PATCH",
            body: JSON.stringify(payload)
        })
    }
}
