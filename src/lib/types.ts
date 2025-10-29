export type GeoPoint = {
    type: 'Point'
    coordinates: [number, number]
}

export type Location = {
    _id?: string
    locality: string
    area: string
    country: string
    country_code?: string
    point?: GeoPoint
}

export type FormLocation = {
    locality: string
    area: string
    country: string
}

export type ProfileForm = {
    fullname: string
    username: string
    email: string
    bio: string
    location: FormLocation
}

export type User = {
    _id: string
    fullname: string
    username: string
    email: string
    bio?: string | null
    createdAt: string
    updatedAt?: string
    profilePic?: string | null
    favs?: string[]
    defaultLocationId: string
    defaultLocation?: Location | null
}

export type ApiUser = {
    _id: string
    fullname: string
    username: string
    email: string
    bio?: string | null
    createdAt: string
    updatedAt?: string
    profilePic?: string | null
    favs?: string[]
    defaultLocationId: string
    defaultLocation?: {
        _id?: string
        locality: string
        area: string
        country: string
        country_code?: string
        point?: GeoPoint
    } | null
}

export type SigninPayload = {
    identifier: string
    password: string
}

export type SignupPayload = {
    fullname: string
    username: string
    email: string
    password: string
}

export type SignupFormPayload = {
    fullname: string
    username: string
    email: string
    password: string
    password2: string
}

export type UpdateProfilePayload = Partial<{
    fullname: string
    username: string
    email: string
    bio: string
    location: FormLocation | null
}>

export type ApiResponse<T> = T | { user: T }

export type RawUser = any

export type AllCoords = {
    count: number
    coords: [number, number][]
}

export type Ingredient = {
    ingredient: string
    amount: number
    measure: string
}

export interface Recipe {
    _id: string
    title: string
    description: string
    recipePic: string
    ingredients: Ingredient[]
    instructions: string[]
    point: {
        type: 'Point'
        coordinates: [number, number]
    }
    locationSnapshot: FormLocation
    locationId?: string
    authorId: {
        _id: string
        fullname: string
        username: string
    }
    dishTypes: string[]
    createdAt: string
    updatedAt: string
}

export type RecipePayload = {
    title: string
    description: string
    ingredients: Ingredient[]
    instructions: string[]
    dishTypes: string[]
    recipePic?: string,
    location: FormLocation
}

export type RecipeCardPreview = {
    _id: string
    title: string
    description: string
    dishTypes: string[]
    recipePic?: string
    locationSnapshot: FormLocation
    point: {
        type: 'Point'
        coordinates: [number, number]
    }
}

export type SearchRecipesFilters = {
    q: string
    country: string
    dishTypes: Set<string>
    nearLat?: number | null
    nearLng?: number | null
    maxKm?: number | null
}
