import {
    Request,
    Response,
    NextFunction,
    Router
} from 'express';
import { authenticate } from '../middlewares/auth';
import { viewResolver } from '../controllers/util';

const router = Router();

router.use('/', require('./lists').default);
router.use('/', require('./accounts').default);
router.use('/', require('./oauths').default);
router.use('/', require('./admins').default);

router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    const result = await viewResolver('/')(
        { 
            csrfToken: res.locals._csrf,
            user: { email: req.session!.email },
            message: req.session!.message
        }
    );
    res.status(200).send(result);
});


export default router;