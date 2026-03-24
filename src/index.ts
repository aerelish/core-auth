/**
 * @file index.ts
 * @description entry point of the application. It starts the server and listens on the specified port.
 * @author Ejohn
 */

import app from './app';
import { ENV } from './config';

const { PORT } = ENV;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
