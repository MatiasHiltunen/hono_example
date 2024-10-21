import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db/sqlite_db'
import { users } from './db/schema'
import { createUser, getAllUsers, getUserById } from './user_controller'

const app = new Hono()

app.get('/', (c) => {

  return c.html(`
    <html>
      <head>
      </head>
      <body>
        <div>
          <h1> ${(new Date()).toLocaleString('fi')} </h1>
        </div>
      </body>
    </html>
    
    `)

})

app.get('/account', (c)=>{

  return c.json({
    username: "testaaja"
  })
})

const userRoute = new Hono()

userRoute.post('/', createUser)

userRoute.get('/', getAllUsers)
userRoute.get('/:id', getUserById)


app.route('/user', userRoute)

const port = 3000
console.log(`Server is running on port http://localhost:${port}`)


serve({
  fetch: app.fetch,
  port
})
