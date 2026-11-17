/**
 * @description: Rate limiters for authentication routes
 * @author Ejohn
 */

import authLoginLimiter from './authLoginLimiter';
import authRegisterLimiter from './authRegisterLimiter';
import authRefreshLimiter from './authRefreshLimiter';

export { authLoginLimiter, authRegisterLimiter, authRefreshLimiter };
