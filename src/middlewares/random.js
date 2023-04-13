const simulateCodes = async (req, res) => {
    try {
        const { code } = req.query
        codeInt = parseInt(code)
        if (!code) throw new Error("you need a code")
        res.status(code)
        res.send(`${code} - sent`);
    } catch (error) {
        res.status(400)
        res.send(`Client Error - ${error.message}`);
    }
}

const ping = async (req, res) => {
    try {
        const { param } = req.body
        if (!param) throw new Error("you need a param")
        res.status(200)
        res.send(`${param} - pong`);
    } catch (error) {
        res.status(400)
        res.send(`Client Error - ${error.message}`);
    }
}

export const RandomMiddlewares = {
    ping,
    simulateCodes
}