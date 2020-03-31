import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {

    private static instance: ConfigService;

    private readonly envConfig: { [key: string]: string };

    constructor() {
        this.envConfig = dotenv.parse(fs.readFileSync('.env'));
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    public static getKey(key: string) {
        return ConfigService.getInstance().get(key);
    }
}