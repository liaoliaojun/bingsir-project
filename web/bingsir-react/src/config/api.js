
// const prefix = '/api' // api地址前缀
export default (config => {
    return Object.keys(config).reduce((copy, name) => {
        copy[name] = `${config[name]}`
        return copy
    }, {})
})({
    "login": "/login",
    "register": "/register",
    "userinfo": "/userinfo"
})
