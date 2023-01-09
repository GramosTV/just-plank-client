import { isGoogleAccount } from "../enums/isGoogleAccount";
import { ProfileStatus } from "../enums/profileStatus";

export interface User {
    id: string,
    email: string,
    password: string,
    name: string,
    unit: number,
    dateOfBirth: string,
    gender: number,
    height: number,
    weight: number,
    statsSet: number,
    emailVerified: number,
    isGoogleAccount: isGoogleAccount,
    profile: ProfileStatus,
}
