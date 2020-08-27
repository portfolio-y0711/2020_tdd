import path from 'path';
import fs from 'fs';

const file_list = 
    fs.readdirSync(path.join(__dirname, '../../../sessions'))
        .reduce((acc, curr) => {
            const key = curr.split('.')[0].toString();
            const val = path.join(__dirname, '../../../sessions/') + curr;
            acc.set(key, val);
            return acc;
        }, new Map<string, any>());

const getSession = (token: any) => {
   return require(file_list.get(token));
};
