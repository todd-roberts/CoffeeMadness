export const connectURL = process.env.NODE_ENV == 'production'
    ? 'https://coffee-madness.herokuapp.com/'
    : 'http://localhost:8080'

console.log(connectURL)
console.log(process.env.NODE_ENV);