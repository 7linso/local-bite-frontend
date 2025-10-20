import { api } from '@/services/api'
import type {
    SigninPayload,
    SignupPayload,
    UpdateProfilePayload
} from './types'

export const auth = {
    signup: (p: SignupPayload) => api.post('/auth/signup', p),

    signin: (p: SigninPayload) => api.post('/auth/signin', p),

    signout: () => api.post('/auth/signout'),

    me: () => api.get('/auth/me'),

    updateProfilePic: (p: { profilePic: string }) => api.patch('/auth/update-profile-pic', p),

    updateProfile: (p: UpdateProfilePayload) => api.patch('/auth/update-profile', p),

    deleteProfile: () => api.delete('/auth/delete-profile')
}
