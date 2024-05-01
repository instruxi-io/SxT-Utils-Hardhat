import fs from 'fs';
import { TaskArgs, Result } from './types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

class SessionManager {
    constructor (){}

    async login(hre: HardhatRuntimeEnvironment, taskArgs: TaskArgs): Promise<Result> {
      const [session, error] = await hre.sxtSDK.authenticate('wallet', ''); 
      if (error) {
        return { success: false, message: 'Failed to authenticate: ' + error.message };
      }
      fs.writeFileSync('tmp/session.json', JSON.stringify(session));
      return { success: true, message: 'Authentication successful' };
    }
}

export default SessionManager;