import { Router } from "express"
import { User } from "../entities/User"
import { AppDataSource } from "../data-source"
import bcrypt from "bcrypt"

const router = Router()

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" })
    }

    const userRepo = AppDataSource.getRepository(User)

    const existingUser = await userRepo.findOne({ where: [{ username }, { email }] })

    if (existingUser) {
        return res.status(400).json({ error: "Username or email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = userRepo.create({
        username,
        email,
        password: hashedPassword,
    })

    await userRepo.save(user)

    res.status(201).json({ message: "Registered successfully" })
})

export default router
