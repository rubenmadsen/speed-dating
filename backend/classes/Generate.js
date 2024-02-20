const crypto = require('crypto')
class Generate{
    static fileName(){
        const buffer = crypto.randomBytes(8)
        return buffer.toString('hex');
    }
}
module.exports = Generate;