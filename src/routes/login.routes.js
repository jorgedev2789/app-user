import {Router} from 'express'

const router = Router()

router.get("/", (req, res) => {
  res.render('login', { message: req.flash('error') });
});

export default router