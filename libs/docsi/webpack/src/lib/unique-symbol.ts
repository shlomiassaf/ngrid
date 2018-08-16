import * as path from 'path';
import * as fs from 'fs';

export const NS = path.dirname(fs.realpathSync(__filename));
