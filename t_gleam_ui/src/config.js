//Define some configurations
let BASE_URL = 'https://www.gleam.ch/someurl'
if (process.env.REACT_APP_HOST_ENV === 'dev') {
  BASE_URL = 'http://localhost:5000'
}
console.log(process.env.REACT_APP_HOST_ENV)
export {BASE_URL};
