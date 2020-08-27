import dotenv from 'dotenv';
import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { oauth2Client } from "../../../src/util/googleApi";
import { Oauth } from '../../../src/models/oauth.entity';

describe('authenticationTest', () => {
    it('test_returns_None_if_no_such_token', (done) => {
        done();
    });
    it.skip('test_returns_new_user_with_correct_email_if_token_exists', (done) => {
        done();
    });
    it.skip('test_returns_existing_user_with_correct_email_if_token_exists', (done) => {
        done();
    });
});

describe('getUser', () => {
    it.skip('test_gets_user_by_email', (done) => {
        done();
    });
    it.skip('test_returns_None_if_no_user_with_that_email', (done) => {
        done();
    });
});
