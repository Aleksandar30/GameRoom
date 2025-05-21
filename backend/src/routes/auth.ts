import { Router } from "express"
import { User } from "../entities/User"
import { AppDataSource } from "../data-source"
import bcrypt from "bcrypt"

const router = Router()

// ✅ Register Route (already working)
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


// ✅ Login Route
router.post("/login", async (req, res) => {
    const { identifier, password } = req.body

    if (!identifier || !password) {
        return res.status(400).json({ error: "Missing credentials" })
    }

    const userRepo = AppDataSource.getRepository(User)

    // Try to find by username or email
    const user = await userRepo.findOne({
        where: [{ username: identifier }, { email: identifier }]
    })

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return res.status(401).json({ error: "Invalid password" })
    }

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({ message: "Login successful", user: userWithoutPassword })
})

export default router
