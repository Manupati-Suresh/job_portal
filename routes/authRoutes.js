import express from 'express'
import { loginController, registerController } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit'

//ip limiter 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
})

//router object 

const router = express.Router()

// routes 

/** 
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - password
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: The Auto-generated id of user collection
 *           example: GHDYRIUWIE89743563JHKYI
 *         name:
 *           type: string
 *           description: User name
 *         lastName:
 *           type: string
 *           description: User Last Name
 *         email:
 *           type: string
 *           description: user email address
 *         password:
 *           type: string
 *           description: user password should be greater than 6 character
 *         location:
 *           type: string
 *           description: user location city or country
 *       example:
 *         id: ASHJTUEO897634K
 *         name: John
 *         lastName: Doe
 *         email: johndoe@gmail.com
 *         password: test@123
 *         location: mumbai
 */



/** 
 * @swagger 
 * tags: 
 *   name: Auth 
 *   description: authnetication apis 
 * 
 * 
 * 
 * 
 * 
 * 
 */

/** 
 * @swagger
 * /api/v1/auth/register:
 *   post: 
 *     summary: register new user 
 *     tags: [Auth]
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: John
 *             lastName: Doe
 *             email: johndoe@gmail.com
 *             password: test@123
 *             location: mumbai
 *     responses:
 *       200: 
 *         description: user created successfully 
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/User'
 *       500: 
 *         description: Internal Server Error 
 */

//REGISTER || POST 
router.post('/register', limiter, registerController)

/** 
 * @swagger 
 * /api/v1/auth/login:
 *   post: 
 *     summary: login page 
 *     tags: [Auth]
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: johndoe@gmail.com
 *             password: test@123
 *     responses: 
 *       200: 
 *         description: login successful 
 *         content: 
 *           application/json: 
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: something went wrong 
 */

// LOGIN || POST 
router.post('/login', limiter, loginController)

//export 

export default router 