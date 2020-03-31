import { ConfigService } from "./config.service";

export default () => ({
    SITE_BASE_URL: ConfigService.getKey("ARGUS_WEBSITE") || null, 
    CRON_GET_INFORMATIONS: ConfigService.getKey("CRON_GET_GAME_INFORMATIONS") || '0 10 * * *',
    ARGUS_ACCOUNT: ConfigService.getKey("ARGUS_ACCOUNT") || null,
    ARGUS_PASSWORD: ConfigService.getKey("ARGUS_PASSWORD") || null,
    ARGUS_WEBSITE: ConfigService.getKey("ARGUS_WEBSITE") || null 
});