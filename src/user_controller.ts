import { Context, Handler } from "hono"
import { users } from "./db/schema"
import { db } from "./db/sqlite_db"
import { eq } from "drizzle-orm"
import { scryptSync } from "crypto"



export async function createUser(c: Context) {

    const data = await c.req.json()

    if (data.username == null) {
        return c.json({ err: "username is required" }, 400)
    }

    if(data.password == null){
        return c.json({err: "password is required"}, 400)
    }

    const key = scryptSync(data.password, "dalkma", 64)

    const user = await db.insert(users).values({
        username: data.username,
        password: key.toString('hex')
    }).returning()


    return c.json(user)
}

export async function getAllUsers(c: Context) {

    const allUsers = await db.select().from(users)

    return c.json(allUsers)
}

export async function getUserById(c: Context) {
    try {

        const { id } = c.req.param()

        let idNumber = Number(id)

        if (!Number.isInteger(idNumber)) {
            return c.json({ err: "Check the params" }, 400)
        }

        const user = await db.select().from(users).where(eq(users.id, idNumber))

        if(!user) {
            return c.json({err: "No user found with that id"}, 404)
        }

        return c.json(user)

    } catch (error) {

        return c.json({ err: "Something went wrong from our side, sorry about that ;(" }, 500)
    }
}
