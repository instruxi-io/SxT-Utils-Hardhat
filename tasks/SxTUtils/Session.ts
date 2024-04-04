import fs from 'fs';
import { TaskArgs, Result } from './types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

class SessionManager {
    constructor (){}

    async login(hre: HardhatRuntimeEnvironment, taskArgs: TaskArgs): Promise<Result> {
      const [session, error] = await hre.sxtSDK.Authenticate();
      if (error) {
        console.error('Failed to authenticate:', error);
        return { success: false, message: 'Failed to authenticate: ' + error };
      }
      fs.writeFileSync('session.json', JSON.stringify(session));
      return { success: true, message: 'Authentication successful' };
    }
}

export default SessionManager;