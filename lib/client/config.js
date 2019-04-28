const connectURL = process.env.NODE_ENV.toLowerCase() == 'production'
    ? 'https://coffee-madness.herokuapp.com/'
    : 'http://localhost:8080'


export default {
    connectURL
};