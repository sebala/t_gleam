//Define some configurations
let BASE_URL = 'http://localhost:5000'
if (process.env.REACT_APP_HOST_ENV === 'production') {
  BASE_URL = 'https://www.gleam.ch/someurl'
}
console.log(process.env.REACT_APP_HOST_ENV)
export {BASE_URL};
