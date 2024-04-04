import ED25519Wallet from './ED25519Wallet'
import { ethers } from 'ethers';
import { AxiosResponse } from 'axios';

export interface Config {
    signer: ethers.Wallet | ED25519Wallet;
    baseUrl: string;
    userId: string;
    joinCode: string;
    scheme: string;
    session: SessionData
}

export interface SessionData {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
  }

export interface HttpSuccess<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export interface HttpError<T = any> extends Error {
    config: any;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
}

export interface AuthCodeData {
    authCode: string;
}