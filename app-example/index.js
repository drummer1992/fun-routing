import http from 'http'
import { Routing } from '../'
import path from 'path'

const pathToServices = path.resolve(__filename, '../services')
const PORT = 3000

async function init() {
  const routing = new Routing({ corsEnabled: true })

  const requestListener = await routing.init(pathToServices)

  http.createServer(requestListener).listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

init().catch(e => {
  console.error(e.stack)

  process.exit(-1)
})