import { Role, User } from "./interfaces"

export interface LoginDto {
    email?: string
    password: string
    phoneNumber?: string
}

export interface RegisterDto {
    email: string
    name: string
    password: string
    role: Role
    phoneCountryCode?: string
    phoneNumber?: string
    file?: File
    carte?: File
    permis?: File
}


export interface UserAuth {
    access_token: string
    refresh_token: string
    user: User
}

export interface RefreshTokenResponse {
    access_token: string
}

