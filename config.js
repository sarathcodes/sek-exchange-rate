const secret = 'd/7bGZrt?2-v@[vKsaf>3CqHNL*H/5*'; // Super secret key to use with JWT
const restCountryAPIKey = '84426a235a27138ed3e098e318ab7af0'; // https://fixer.io/ API key to get exchange rates
const apiLimitPerMinute = 60; // Number of requests allower per minute per user

module.exports = {
    secret,
    restCountryAPIKey,
    apiLimitPerMinute
}