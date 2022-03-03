const fs = require('fs')
const useRoutes = function () {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') {
            return
        } else {
            //this指向调用者app
            const router = require(`./${file}`)
            this.use(router.routes())
            this.use(router.allowedMethods())
        }
    })
}
module.exports = useRoutes;
