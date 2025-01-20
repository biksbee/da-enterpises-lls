export type SessionCreateType = {
    token: string;
    providerId: number;
    fingerprint?: string;
    userId: string;
}

export type SessionDeleteSameType = {
    userId: string;
    fingerprint?: string | null;
    providerId: number;
}

export type SessionGetByTokenType = {
    token: string;
    providerId: number;
}