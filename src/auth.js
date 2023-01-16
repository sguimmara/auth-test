import log from "./log.js";
import fs from 'fs';
import { pbkdf2 } from "pbkdf2";
import { pbkdf2Sync } from "crypto";

const DB_PATH = './data/credentials.json';
const SALT = 'salt';

class CredentialDatabase {
    constructor(users) {
        /** @type {Array} */
        this.users = users ?? [];
    }

    serialize() {
        return JSON.stringify(this, null, 4);
    }

    static default() {
        return new CredentialDatabase();
    }

    static open() {
        const users = JSON.parse(fs.readFileSync(DB_PATH)).users;
        return new CredentialDatabase(users);
    }

    close() {
        fs.writeFileSync(DB_PATH, this.serialize());
    }
}

function check() {
    log.info('checking database...');

    const db = CredentialDatabase.open();

    if (db.users) {
        if (exists('root')) {
            log.success('database OK.');
        } else {
            log.error('invalid database.');
        }
    }
}

function init() {
    log.info('auth: initializing auth module...');
    if (!fs.existsSync(DB_PATH)) {
        log.info('auth: credential file not found. Creating.');
        fs.writeFileSync(DB_PATH, CredentialDatabase.default().serialize());

        addUser('root', 'root');
    } else {
        check();
    }
    log.success('auth: auth module initialized.');
}

function getHash(password) {
    return pbkdf2Sync(password, SALT, 1, 32, 'sha512').toString('hex');
}

function exists(username) {
    const db = CredentialDatabase.open();
    log.info(`checking user '${username}'`);
    return db.users.some(u => u.name === username);
}

function addUser(name, password) {
    log.success(`user '${name}' added successfully.`);

    const db = CredentialDatabase.open();
    const hash = getHash(password);

    db.users.push({ name, hash });

    db.close();
}

export default {
    init,
    addUser,
}