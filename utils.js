const bodyHandler = async (req) => {
    let data = '';
    for await (const chunk of req) {
        data += chunk
    }
    return JSON.parse(data)
}

const errorStatusCodeHandler = (res, statusCode, message = '') => {
    res.statusCode = statusCode
    res.end(JSON.stringify({
        error: message
    }))
}

const successStatusCodeHandler = (res, data = null) => {
    res.statusCode = 200
    if(data){
        res.end(data)
        return
    }
    res.end()
}
module.exports = {
    bodyHandler,
    errorStatusCodeHandler,
    successStatusCodeHandler
}