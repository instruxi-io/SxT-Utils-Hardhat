export interface EnforcerTaskArgs {
    accountaddress?: string;
    signedchallenge?: string;
    chainid?: string;
    policy?: string;
    username?: string;
    email?: string;
    account?: string;
    signature?: string;
    tenantcode?: string;
    apikey?: string;
    tenantid?: string;
    nonce?: string;
    message?: string;
    deployer: any;
}

export interface Result {
  success: boolean;
  message: string;
}

export interface PromptResponse {
  input: string;
}
