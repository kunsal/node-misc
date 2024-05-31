import express, {Express, Request, Response} from 'express';
import cbtRouter from './modules/cbt/cbt.routes';
import roleRouter from './modules/role/role.routes';
import userRouter from './modules/user/user.routes';
import authRouter from './modules/auth/auth.routes';
import sequelize from './config/database';
import cors from 'cors';
import bodyParser from 'body-parser';

const app: Express = express();

const initApp = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully');
        app.use(cors());
        app.use(bodyParser());

        app.get('/', (req, res) => {
            res.send({
                error: false, 
                message: 'Connected to CBT'
            })
        })
        
        app.use('/cbt', cbtRouter);
        app.use('/roles', roleRouter);
        app.use('/users', userRouter);
        app.use('/auth', authRouter);

        app.listen(3004, () => {
            console.log('App running on port 3004');
        });
    } catch (error) {
        console.log('Connection failed: ', error)
    }
}

initApp();

