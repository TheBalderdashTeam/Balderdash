import postgres from 'postgres'
require('dotenv').config()

const sql = postgres({ 
    host                 : process.env.DB_HOST,         
    port                 : parseInt(process.env.DB_PORT as string),          
    database             : process.env.DB_NAME,            
    username             : process.env.DB_USERNAME,            
    password             : process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
})

export default sql
