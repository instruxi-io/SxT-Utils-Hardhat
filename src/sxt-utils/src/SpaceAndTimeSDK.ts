import axios, { AxiosResponse } from 'axios';
//import os from 'os';
//import fs from 'fs';
import { Buffer } from 'buffer';
import { Utils } from './utils/utils-functions';
import ED25519Wallet from './ED25519Wallet'
import { ethers } from 'ethers';
import * as nacl from 'tweetnacl';
import { HttpSuccess, HttpError, AuthCodeData, Config, SessionData } from './types';

export default class SpaceAndTimeSDK implements Config  {
    signer: ethers.Wallet | ED25519Wallet;
    baseUrl: string;
    userId: string;
    joinCode: string;
    scheme: string;
    session: SessionData;

    constructor({ signer, baseUrl, userId, joinCode, scheme, session }: Config) {
        this.baseUrl = baseUrl;
        this.signer = signer;
        this.userId = userId; 
        this.joinCode = joinCode;
        this.scheme = scheme;
        this.session = session
    } 

    async isSessionExpired(): Promise<boolean> {
        return Date.now() > this.session.accessTokenExpires;
    }

    static init(config: Config): SpaceAndTimeSDK {
        return new SpaceAndTimeSDK(config);
    }
    
    async generateAuthCode(userId: string = this.userId, prefix?: string, joinCode?: string): Promise<[string | null, string | null]> {
        try {
            Utils.checkPrefixAndJoinCode(prefix, joinCode);
            Utils.checkUserIdFormat(userId)
            const payload = {
                userId: userId,
                prefix: prefix,
                joinCode: joinCode
            };
            const response: AxiosResponse<HttpSuccess<AuthCodeData>> = await axios.post(`${this.baseUrl}/auth/code`, payload);
            if (response.data) {
    
                return [response.data.authCode, null];
            } else {
                return [null, "Response data is undefined"];
            }
        }
        catch(error) {
            const err = error as HttpError;
            return [null, err.message];
        }
    }

    async checkUserId(userId: string = this.userId): Promise<[HttpSuccess | null, null | HttpError ]> {
        try {
            Utils.checkUserIdFormat(userId)
            const response: AxiosResponse<HttpSuccess> = await axios.get(`${this.baseUrl}/auth/idexists/${userId}`);
            return [response.data, null];
        } catch (error) {
            const err = error as HttpError;
            return [null, err];
        }
    }
     
    async checkUserIdExistance(userId: string = this.userId): Promise<boolean | null> {
        try {
            Utils.checkScheme(userId);
            let [userIdResponse, userIdError]: [HttpSuccess | null, null | HttpError ] = await this.checkUserId(userId);
            if (userIdError) throw new Error(userIdError.message);
            return userIdResponse ? true : false;
        } catch (error) {
            return null;
        }
    }

    async generateSignature(message: string, scheme: string = this.scheme): Promise<string> {
        try {
            Utils.checkStringFormat(message)
            Utils.checkScheme(scheme);
    
            if (scheme === "ed25519" || "ED25519") {
                let authCode = new TextEncoder().encode(message); 
                // Ensure privateKey is a Uint8Array
                let privateKey = this.signer.privateKey instanceof Uint8Array ? this.signer.privateKey : new TextEncoder().encode(this.signer.privateKey);
                let signatureArray = nacl.sign(authCode, privateKey);
                let signature = Buffer.from(signatureArray.buffer, signatureArray.byteOffset, signatureArray.byteLength).toString('hex');
                return signature.slice(0,128);
            } else if (scheme === "ecdsa" || "ECDSA") {
                return await this.signer.signMessage(message);
            } else {
                throw new Error("Invalid scheme");
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }

    async generateToken(userId: string = this.userId, scheme: string = this.scheme, authCode: string, signature: string): Promise<[HttpSuccess | null, null | HttpError ]> {      
        try {
            Utils.checkStringFormat(authCode);
            Utils.checkSignature(signature);
            Utils.checkScheme(scheme);
            let key: string;
            if (scheme === "ed25519" || scheme === "ED25519") {
                if (typeof this.signer !== 'object' || !(this.signer instanceof ED25519Wallet)) {
                    const error: HttpError = {
                        name: 'Error',
                        message: "ED25519 requires b64 encoded string as signer",
                        config: {},
                    };
                    return [null, error];
                }
                key = Buffer.from(this.signer.publicKey).toString("base64");
            } else if (scheme === "ecdsa" || scheme === "ECDSA") {
                if (typeof this.signer !== 'object' || !(this.signer instanceof ethers.Wallet)) {
                    const error: HttpError = {
                        name: 'Error',
                        message: "ECDSA requires ethers.Wallet object as signer",
                        config: {},
                    };
                    return [null, error];
                };
                key = this.signer.address;
            } else {
                const error: HttpError = {
                    name: 'Error',
                    message: "invalid scheme",
                    config: {},
                };
                return [null, error];
            }
            const payload = {
                userId: userId,
                authCode: authCode,
                signature: signature,
                key: key,
                scheme: this.scheme
            }
            const response: AxiosResponse<HttpSuccess> = await axios.post(`${this.baseUrl}/auth/token`, payload);
    
            if (response.status !== 200) {
                const error: HttpError = {
                    name: 'Error',
                    message: `Request failed with status code ${response.status}`,
                    config: {},
                    response: response
                };
                return [null, error];
            }
    
            const success: HttpSuccess = {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                config: response.config,
                request: response.request
            };
            return [success, null];
        } catch (error) {
            const err = error as Error;
            const httpError: HttpError = {
                name: 'Error',
                message: err.message,
                config: {},
            };
            return [null, httpError];
        }
    }

    async AuthenticateUser(userId: string = this.userId): Promise<[SessionData | null, null | HttpError ]> {
        try {
            let userIdStatus = await this.checkUserIdExistance(userId);
            
            if(userIdStatus === false || userIdStatus === null) {
                return this.Authenticate(userId);
            }
            else {
                return this.Authenticate();
            }
        } catch (error) {
            const err = error as Error;
            const httpError: HttpError = {
                name: 'Error',
                message: err.message,
                config: {},
            };
            return [null, httpError];
        }
    }

    async Authenticate(userId: string = this.userId, joinCode: string = this.joinCode, prefix: string = ""): Promise<[SessionData | null, null | HttpError ]> {
        try {
            let [authCodeResponse, authCodeError] = await this.generateAuthCode(userId, prefix, joinCode);
            if (!authCodeResponse) {
                const error: HttpError = {
                    name: 'Error',
                    message: `Auth code response is null. ${authCodeError}`,
                    config: {},
                };
                return [null, error];
            }
            let signature: string = await this.signer.signMessage(authCodeResponse);
            let [tokenResponse, tokenError] = await this.generateToken(userId, this.scheme, authCodeResponse, signature);
            if (tokenError) {
                return [null, tokenError];
            } else if (tokenResponse && tokenResponse.data) {
                let accessToken = tokenResponse.data.accessToken, refreshToken = tokenResponse.data.refreshToken;
                let accessTokenExpires = tokenResponse.data.accessTokenExpires, refreshTokenExpires = tokenResponse.data.refreshTokenExpires
                this.session = { accessToken, refreshToken, accessTokenExpires, refreshTokenExpires }
                return [{accessToken, refreshToken, accessTokenExpires, refreshTokenExpires}, null];
            } else {
                const error: HttpError = {
                    name: 'Error',
                    message: "Token response or token data is null",
                    config: {},
                };
                return [null, error];
            }
        } catch (error) {
            const err = error as Error;
            const httpError: HttpError = {
                name: 'Error',
                message: err.message,
                config: {},
            };
            return [null, httpError];
        }
    }

    public base64ToUint8(base64PrivateKey: string, base64PublicKey: string): Uint8Array {
        Utils.isBase64(base64PrivateKey);
        Utils.isBase64(base64PublicKey);
       
        let privateKeyBuffer = Buffer.from(base64PrivateKey, 'base64');
        let publicKeyBuffer = Buffer.from(base64PublicKey, 'base64');
    
        let privateKeyUint8 = new Uint8Array(privateKeyBuffer.buffer, privateKeyBuffer.byteOffset, privateKeyBuffer.byteLength);
        let publicKeyUint8 = new Uint8Array(publicKeyBuffer.buffer, publicKeyBuffer.byteOffset, publicKeyBuffer.byteLength);
       
        let combinedPrivateKey: number[] = [];
    
        if(privateKeyUint8.length === publicKeyUint8.length) {
            for(let idx = 0; idx < privateKeyUint8.length; idx++) {
                combinedPrivateKey[idx] = privateKeyUint8[idx];
            }
        
            for(let idx = 0; idx < publicKeyUint8.length; idx++) {
                combinedPrivateKey[privateKeyUint8.length + idx] = publicKeyUint8[idx];
            }
        }
    
        let combinedPrivateKeyUint8 = new Uint8Array(combinedPrivateKey);
    
        return combinedPrivateKeyUint8;
    }

    async refreshToken(refreshToken?: string): Promise<[SessionData | null, null | HttpError ]> {
        try {
            refreshToken = refreshToken || this.session.refreshToken;
            
            if (!refreshToken) {
                const error: HttpError = {
                    name: 'Error',
                    message: 'Refresh token is not provided',
                    config: {},
                };
                return [null, error];
            }
    
            Utils.checkStringFormat(refreshToken);
    
            const response = await axios.post(`${this.baseUrl}/auth/refresh`, null, {
                headers: {
                    Authorization : `Bearer ${refreshToken}`
                }  
            });
    
            const { accessToken, refreshToken: newRefreshToken, accessTokenExpires, refreshTokenExpires } = response.data;
    
            if (!newRefreshToken) {
                const error: HttpError = {
                    name: 'Error',
                    message: 'Refresh token is not provided',
                    config: {},
                };
                return [null, error];
            }
    
            this.session = { accessToken, refreshToken: newRefreshToken, accessTokenExpires, refreshTokenExpires }
            return [{ accessToken, refreshToken: newRefreshToken, accessTokenExpires, refreshTokenExpires }, null];
        } catch (error) {
            const httpError: HttpError = {
                name: 'Error',
                message: typeof error === 'string' ? error : 'Unknown error',
                config: {},
            };
            return [null, httpError];
        }
    }

    async logout(): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            Utils.checkStringFormat(this.session.refreshToken);
    
            const response = await axios.post(`${this.baseUrl}/auth/logout`, null, {
                headers: {
                    Authorization : `Bearer ${this.session.refreshToken}`
                }  
            });
    
            return [response, null];
        } catch (error) {
            const httpError: HttpError = {
                name: 'Error',
                message: error instanceof Error ? error.message : 'An unknown error occurred',
                config: {},
            };
            return [null, httpError];
        }
    }

    private updateUrlVersion(apiUrl: string): string {
        const newVersion: string = "v2"
        const urlParts: string[] = apiUrl.split("/")
        urlParts[urlParts.length-1] = newVersion
        return urlParts.join("/");
    }

    async getSchemas(scope: string = "", schema: string = ""): Promise<[HttpSuccess | null, null | HttpError]> {
        try {        
            let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
            let accessToken: string = '';
           
            accessToken = this.session.accessToken;
            
            let endpoint: string | null = null;
    
            if(scope == "" && schema == "") {
                endpoint = `${v2versionURL}/discover/schema`;
            }
            else if(scope != "" && schema == "") {
                endpoint = `${v2versionURL}/discover/schema?scope=${scope}`;
            }
            else {
                Utils.checkStringFormat(scope);
                Utils.checkStringFormat(schema);
    
                scope = scope.toUpperCase();
                schema = schema.toUpperCase();
                endpoint = `${v2versionURL}/discover/schema?scope=${scope}&searchPattern=${schema}`
            }
    
            Utils.checkApiVersion(endpoint);
    
            let accessTokenValue: string = `Bearer ${accessToken}`; 
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                }
            }
    
            const response: AxiosResponse = await axios.get(endpoint, config);
            return [response, null];
        }
        catch(error: any) {
            const httpError: HttpError = {
                name: 'Error',
                message: error.message,
                config: {},
            };
            return [null, httpError];
        }
    }

    async getTables(scope: string, schema: string, table: string = ""): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken: string = this.session.accessToken;
        
            let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
            let endpoint: string | null = null;
    
            Utils.checkStringFormat(scope);
            Utils.checkPostgresIdentifier(schema);
    
            scope = scope.toUpperCase();
            schema = schema.toUpperCase();
            
            if(table == "") {
                endpoint = `${v2versionURL}/discover/table?scope=${scope}&schema=${schema}`
            }
            else {
                table = table.toUpperCase();
                endpoint = `${v2versionURL}/discover/table?scope=${scope}&schema=${schema}&searchPattern=${table}`
            }
    
            Utils.checkApiVersion(endpoint);
    
            let accessTokenValue: string = `Bearer ${accessToken}`; 
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                }
            }
    
            const response: AxiosResponse = await axios.get(endpoint, config);
            return [response, null];
        }
        catch(error: any) {
            const httpError: HttpError = {
                name: 'Error',
                message: error.message,
                config: {},
            };
            return [null, httpError];
        }
    }
    
    private async discoveryAPIRequest(schema: string, tableName: string, endpoint: string): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken: string = this.session.accessToken;
    
            Utils.checkPostgresIdentifier(schema);
            Utils.checkPostgresIdentifier(tableName);
            Utils.checkApiVersion(endpoint);
    
            schema = schema.toUpperCase();
            tableName = tableName.toUpperCase();
    
            let accessTokenValue: string = `Bearer ${accessToken}`; 
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                }
            };
    
            const response: AxiosResponse = await axios.get(endpoint, config);
            return [response, null];
        }
        catch(error: any) {
            const httpError: HttpError = {
                name: 'Error',
                message: error.message,
                config: {},
            };
            return [null, httpError];
        }
    }

    async getTableColumns(schema: string, tableName: string): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/table/column?schema=${schema}&table=${tableName}`;
        return await this.discoveryAPIRequest(schema, tableName, endpoint);
    }

    async getTableIndexes(schema: string, tableName: string): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/table/index?schema=${schema}&table=${tableName}`;
        return await this.discoveryAPIRequest(schema, tableName, endpoint);
    }
    
    async getPrimaryKeys(schema: string, tableName: string): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/table/primaryKey?schema=${schema}&table=${tableName}`;
        return await this.discoveryAPIRequest(schema, tableName, endpoint);
    }
    
    private async discoveryAPIReferencesRequest(schema: string, tableName: string, column: string, endpoint: string): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken: string = this.session.accessToken;
    
            Utils.checkPostgresIdentifier(schema);
            Utils.checkPostgresIdentifier(tableName);
            Utils.checkStringFormat(column);
            Utils.checkApiVersion(endpoint);
    
            schema = schema.toUpperCase();
            tableName = tableName.toUpperCase();
            column = column.toUpperCase();
    
            let accessTokenValue: string = `Bearer ${accessToken}`; 
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                }
            };
    
            const response: AxiosResponse = await axios.get(endpoint, config);
            return [response, null];
        }
        catch(error: any) {
            const httpError: HttpError = {
                name: 'Error',
                message: error.message,
                config: {},
            };
            return [null, httpError];
        }
    }
    
    async getPrimaryKeyReferences(schema: string, tableName: string, column: string): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/refs/primarykey?schema=${schema}&table=${tableName}&column=${column}`;
        return await this.discoveryAPIReferencesRequest(schema, tableName, column, endpoint);
    }
    
    async getForeignKeyReferences(schema: string, tableName: string, column: string): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/refs/foreignkey?schema=${schema}&table=${tableName}&column=${column}`;
        return await this.discoveryAPIReferencesRequest(schema, tableName, column, endpoint);
    }
    
    async getTableRelationships(schema: string, scope: string): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken: string = this.session.accessToken;
            let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
    
            Utils.checkPostgresIdentifier(schema);
            Utils.checkStringFormat(scope);
    
            schema = schema.toUpperCase();
            scope = scope.toUpperCase();    
    
            let accessTokenValue: string = `Bearer ${accessToken}`; 
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                }
            };
    
            const response: AxiosResponse = await axios.get(`${v2versionURL}/discover/table/relations?scope=${scope}&schema=${schema}`, config);
            return [response, null];
        }
        catch(error: any) {
            const httpError: HttpError = {
                name: 'Error',
                message: error.message,
                config: {},
            };
            return [null, httpError];
        }
    } 

    private async blockchainDataAPIRequest(url: string, chainId: string = ""): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            Utils.checkApiVersion(url);
            let accessToken: string = this.session.accessToken;
    
            if (chainId !== "") {
                Utils.checkStringFormat(chainId);
            }
    
            let accessTokenValue: string = `Bearer ${accessToken}`;
            let config = {
                headers: {
                    Authorization: accessTokenValue
                }
            };
    
            let response: AxiosResponse = await axios.get(url, config);
            return [response, null];
        }
        catch(error: any) {
            const httpError: HttpError = {
                name: 'Error',
                message: error.message,
                config: {},
            };
            return [null, httpError];
        }
    }
    
    async getBlockchains(): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/blockchains`;
        return await this.blockchainDataAPIRequest(endpoint);
    }
    
    async getBlockchainSchemas(chainId: string): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/blockchains/${chainId}/schemas`;
        return await this.blockchainDataAPIRequest(endpoint, chainId);
    }
    
    async getBlockchainInformation(chainId: string): Promise<[HttpSuccess | null, null | HttpError]> {
        let v2versionURL: string = this.updateUrlVersion(this.baseUrl);
        let endpoint: string = `${v2versionURL}/discover/blockchains/${chainId}/meta`;
        return await this.blockchainDataAPIRequest(endpoint, chainId);
    }

    /*
    private parseSQLErrorMessage = (error: unknown): [any, any] => {
        if (error instanceof Error && error.toString().startsWith('Error')) {
            return [null, error];
        }
    
        let mainErrorMessage = null;
        try {
            mainErrorMessage = JSON.parse(JSON.stringify((error as HttpError).response?.data));
        } catch (parseError) {
            return [null, (parseError as Error).message];
        }
    
        let title = mainErrorMessage["title"];
        let detail = mainErrorMessage["detail"]
            .split("\n")
            .slice(0, 3)
            .join("\n")
            .replace(/(\S)\n(\S)/g, "$1 $2");
    
        return [null, `${title} : ${detail}\n${(error as Error).message}`];
    }
    */
    public addSecuritySuffix(sqlText: string, publicKey: string, accessType: string): string {
        return sqlText + " WITH \"public_key=" + publicKey + ",access_type=" + accessType + "\""
    }

    async createSchema(sqlText: string, biscuitTokens: string[] = [], originApp: string = ""): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            const accessToken = this.session.accessToken;
            Utils.checkStringFormat(sqlText);
            Utils.checkArrayFormat(biscuitTokens);
            sqlText = sqlText.toUpperCase();
    
            const payload = {
                biscuits: biscuitTokens,
                sqlText: sqlText
            }
    
            const accessTokenValue = 'Bearer ' + accessToken;
            const config = {
                headers: {
                    Authorization: accessTokenValue,
                    originApp: originApp
                }
            }
    
            const response: AxiosResponse<HttpSuccess> = await axios.post(`${this.baseUrl}/sql/ddl`, payload, config);
            return [ response.data, null ];
        }
        catch(error) {
            const err = error as HttpError;
            return [ null, err ];
        }
    }
    
    async createTable(sqlText: string, accessType: string, biscuitTokens: string[] = [], originApp: string = ""): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken = this.session.accessToken;
            Utils.checkStringFormat(sqlText);   
            Utils.checkStringFormat(accessType)
    
            let payload = {
                biscuits: biscuitTokens,
                sqlText: sqlText,
            } 
    
            let accessTokenValue = 'Bearer ' + accessToken; 
            
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                    originApp: originApp
                }
            }
    
            const response: AxiosResponse<HttpSuccess> = await axios.post(`${this.baseUrl}/sql/ddl`, payload, config);
            return [ response.data, null ];
        }
        catch(error){
            const err = error as HttpError;
            return [ null, err ];
        }
    }

    async DDL(sqlText: string, biscuitTokens: string[] = [], originApp: string = ""): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken = this.session.accessToken;
            Utils.checkStringFormat(sqlText);
            Utils.checkArrayFormat(biscuitTokens);

            let payload = {
                biscuits: biscuitTokens,
                sqlText: sqlText.toUpperCase(),
            }
        
            let accessTokenValue = 'Bearer ' + accessToken; 
            
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                    originApp: originApp
                }
            }

            const response: AxiosResponse<HttpSuccess> = await axios.post(`${this.baseUrl}/sql/ddl`, payload, config);
            return [ response.data, null ];
        }
            
        catch(error) {
            const err = error as HttpError;
            return [ null, err ];
        }
    } 

    async DML(resources: string[], sqlText: string, biscuitTokens: string[] = [], originApp: string = ""): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken =this. session.accessToken;

            Utils.checkPostGresIdentifiers(resources);
            Utils.checkStringFormat(sqlText);
            Utils.checkArrayFormat(biscuitTokens);
            
            let payload = {
                biscuits: biscuitTokens,
                resources: resources,
                sqlText: sqlText
            }

            let accessTokenValue = 'Bearer ' + accessToken; 
            
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                    originApp: originApp
                }
            }

            const response: AxiosResponse<HttpSuccess> = await axios.post(`${this.baseUrl}/sql/dml`, payload, config);
            return [ response.data, null ];
        }

        catch(error) {
            const err = error as HttpError;
            return [ null, err ];
        }
    }

    async DQL(resources: string[], sqlText: string, biscuitTokens: string[] = [], originApp: string = "", rowCount: number = 0): Promise<[HttpSuccess | null, null | HttpError]> { 
        try {
            let accessToken = this.session.accessToken;
            Utils.checkPostGresIdentifiers(resources);
            Utils.checkStringFormat(sqlText);
            Utils.checkArrayFormat(biscuitTokens);

            let payload = {};
            if(rowCount > 0) {
                payload = {
                    biscuits: biscuitTokens,
                    resources:resources,
                    sqlText: sqlText,
                    rowCount: rowCount
                }
            }
            else {
                payload = {
                biscuits: biscuitTokens,
                resources: resources,
                sqlText: sqlText
                }
            }
            let accessTokenValue = 'Bearer ' + accessToken; 
            let config = {
                headers: {
                    Authorization: accessTokenValue,
                    originApp: originApp
                }
            }
            let response: AxiosResponse<HttpSuccess> = await axios.post(`${this.baseUrl}/sql/dql`, payload, config);
            return [ response, null ];
        }
        catch(error) {
            const err = error as HttpError;
            console.log(err)
            return [ null, err ];
        }
    }

    async executeView(viewName: string, parametersRequest: { name: string, type: string }[] = []): Promise<[HttpSuccess | null, null | HttpError]> {
        try {
            let accessToken = this.session.accessToken;

            Utils.checkStringFormat(viewName);

            let paramEndPoint = "";
            let paramString = "";
            let apiEndPoint =`${this.baseUrl}/sql/views/${viewName}`

            if(Object.keys(parametersRequest).length > 0) {
                for(const { name,type } of parametersRequest) {
                    paramString += `${name}=${type}&`
                }

                paramString = paramString.slice(0, paramString.length - 1);
                paramEndPoint += `?params=${paramString}`;
            }

            apiEndPoint += paramEndPoint;
            let accessTokenValue = 'Bearer ' + accessToken; 

            let config = {
                headers: {
                    Authorization: accessTokenValue,
                }
            }

            const response: AxiosResponse<HttpSuccess> = await axios.get(apiEndPoint, config);
            return [ response.data, null ];
        }
        catch(error){
            const err = error as HttpError;
            return [ null, err ];
        }
    }
}