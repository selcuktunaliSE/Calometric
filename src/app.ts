import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRouter from './modules/auth/router'
import foodsRouter from './modules/foods/router'




const app = express()

app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)
app.use(helmet())
app.use(morgan('tiny'))
app.use('/foods', foodsRouter)


// basit sağlık kontrolü
app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

export default app
