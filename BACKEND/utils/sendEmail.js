import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config()

console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)
export const  sendEmail = async (to , subject , text) =>{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        }
    })
    await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to,
        subject,
        text
    })
} 