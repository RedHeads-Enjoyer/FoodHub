const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routers/authRouter')
const recipeIngredientRouter = require('./routers/recipeIngredientRouter')
const recipeRouter = require('./routers/recipeRouter')
const recipeTypeRouter = require('./routers/recipeTypeRouter')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api', recipeIngredientRouter)
app.use('/api', recipeRouter)
app.use('/api', recipeTypeRouter)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://user:changeme@cluster0.iydzlcz.mongodb.net/FoodHub?retryWrites=true&w=majority&appName=Cluster0`)
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
