import {
    Request,
    Response,
    NextFunction,
    Router
} from 'express';
import { viewResolver } from '../controllers/util';

const router = Router();

router.use('/', require('./lists').default);
router.use('/', require('./accounts').default);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const result = await viewResolver('/')(
        { 
            csrfToken: res.locals._csrf,
            user: { email: 'yoonsung0711@gmail.com' },
            messages: [
                { message: 'Check your email, we\'ve sent you a link you can use to log in!', success: true },

            ]
        }
    );
    res.status(200).send(result);
});


export default router;