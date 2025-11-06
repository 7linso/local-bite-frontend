import { api } from '@/services/api'
import type { AllCoords } from '../types'

export const locations = {
    getAllLocCoords: async (): Promise<AllCoords> => 
        api.get<AllCoords>('/loc/all/coords'),

}