export type Location = {
    locality: string
    area: string
    country: string
    country_code: string
    point: { type: 'Point'; coordinates: [number, number] }
};

export type FormLocation = {
    locality: string
    area: string
    country: string
};

export type ProfileForm = {
    fullname: string
    username: string
    email: string
    bio: string
    location: FormLocation
};

export type RawUser = any

export type User = {
    _id: string
    fullname: string
    username: string
    email: string
    bio?: string | null
    createdAt: string
    updatedAt?: string
    profilePic?: string | null
    location?: Location | null
}

export type UpdateProfilePayload = Partial<{
    fullname: string;
    username: string;
    email: string;
    bio: string;
    location: FormLocation | null;
}>;

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

export type ApiUser = {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  bio?: string | null;
  createdAt: string;
  updatedAt?: string;
  profilePic?: string 
  location?: {
    locality: string;
    area: string;
    country: string;
    country_code: string;
    point: { type: 'Point'; coordinates: [number, number] };
    formatted?: string;
  } | null;
};

export type ApiResponse<T> = T | { user: T };