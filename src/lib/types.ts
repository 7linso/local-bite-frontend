export type GeoPoint = { type: 'Point'; coordinates: [number, number] };

export type Location = {
    _id?: string;
    locality: string;
    area: string;
    country: string;
    country_code?: string;
    point?: GeoPoint;
};

export type FormLocation = {
    locality: string;
    area: string;
    country: string;
};

export type ProfileForm = {
    fullname: string;
    username: string;
    email: string;
    bio: string;
    location: FormLocation;
};

export type User = {
    _id: string;
    fullname: string;
    username: string;
    email: string;
    bio?: string | null;
    createdAt: string;
    updatedAt?: string;
    profilePic?: string | null;
    favs?: string[];
    defaultLocationId: string,
    defaultLocation?: Location | null;
};

export type ApiUser = {
    _id: string;
    fullname: string;
    username: string;
    email: string;
    bio?: string | null;
    createdAt: string;
    updatedAt?: string;
    profilePic?: string | null;
    favs?: string[];
    defaultLocationId: string,
    defaultLocation?: {
        _id?: string;
        locality: string;
        area: string;
        country: string;
        country_code?: string;
        point?: GeoPoint;
    } | null;
};

export type SigninPayload = {
    identifier: string;
    password: string
};

export type SignupPayload = {
    fullname: string;
    username: string;
    email: string;
    password: string;
};

export type UpdateProfilePayload = Partial<{
    fullname: string;
    username: string;
    email: string;
    bio: string;
    location: FormLocation | null;
}>;

export type ApiResponse<T> = T | { user: T };
export type RawUser = any;
