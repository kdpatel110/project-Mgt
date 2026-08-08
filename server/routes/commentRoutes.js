import express from 'express'
import { addComment, gettaskComments } from '../controllers/commentContoller.js'


const commentRouter = express.Router()

commentRouter.post('/', addComment);
commentRouter.get('/:taskId', gettaskComments);

export default commentRouter