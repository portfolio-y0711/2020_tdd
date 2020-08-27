import { v4 as uuid } from 'uuid';

export const gen_token = () => {
    return uuid();
};