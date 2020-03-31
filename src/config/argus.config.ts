export default () => ({
    SITE_BASE_URL: process.env.ARGUS_WEBSITE || null, 
    CRON_GET_INFORMATIONS: process.env.CRON_GET_GAME_INFORMATIONS || '0 10 * * *',
    ARGUS_ACCOUNT: process.env.ARGUS_ACCOUNT || null,
    ARGUS_PASSWORD: process.env.ARGUS_PASSWORD || null,
    ARGUS_WEBSITE: process.env.ARGUS_WEBSITE || null 
});