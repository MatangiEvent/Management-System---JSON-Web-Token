import { cleanEnv, port, str } from 'envalid';


export default cleanEnv(process.env , {
    MONGO_CONNECTION_STRING : str(),
    PORT : port(),
    JWT_SECRET : str(),
    SESSION_SECRET : str(),
    RAZORPAY_KEY_ID : str(),
    RAZORPAY_SECRET : str()
})