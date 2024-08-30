import fs from 'fs';
import path from 'path';
import { TaskArgs, Result } from './types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

class SessionManager {
    constructor (){}

    async login(hre: HardhatRuntimeEnvironment, taskArgs: TaskArgs): Promise<Result> {
      const [session, error] = await hre.sxtSDK.authenticate('wallet', ''); 
      if (error) {
        return { success: false, message: 'Failed to authenticate: ' + error.message };
      }

      const dir = 'tmp';
      const filePath = path.join(dir, 'session.json');

      // Ensure the directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(session));
      return { success: true, message: 'Authentication successful' };
    }
}

export default SessionManager;