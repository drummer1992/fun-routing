import { ApiError } from '../errors'
import {
  Get,
  Post,
  Put,
  Patch,
  Prefix,
  Delete,
  Code,
  Param,
  Body,
  Response,
  Headers,
  Context,
  Decorate,
  HttpCode as c,
  getContext,
} from '../../lib'

let users = []

const auth = fn => (...args) => {
  const { token } = getContext().request.headers

  if (token !== 'tropa') {
    throw new ApiError('Authorization failed')
  }

  return fn(...args)
}

const logger = fn => (...args) => {
  console.log('user logger')

  return fn(...args)
}

const welcome = fn => (...args) => {
  console.log('welcome')

  return fn(...args)
}

@Decorate(auth, logger)
@Prefix('/user')
export default class UserController {
  @Decorate(welcome)
  @Get('/')
  getProfiles() {
    return users
  }

  @Get('/{userId}/profile/{profileId}')
  getProfileById(@Response() res, @Param('userId') userId, @Param('profileId') profileId) {
    const user = users.find(user => user.id === userId && user.profile?.id === profileId)

    res.raw.setHeader('Content-Type', 'application/json')
    res.raw.end(JSON.stringify(user ? user : { message: 'User not found' }))
  }

  @Headers({ 'Content-Type': 'text/plain' })
  @Code(c.CREATED)
  @Post()
  createProfile(@Body() body) {
    const id = Math.floor(Math.random() * 1e6).toString()

    users.push({ id, ...(body) })

    return id
  }

  @Put('/{id}')
  updateProfile(@Param() { id }, @Body() changes) {
    if (!id) throw new ApiError('id is required')
    if (!changes) throw new ApiError('changes are required')

    const user = users.find(user => user.id === id)

    if (!user) throw new ApiError('User not found')

    Object.assign(user, changes)
  }

  @Patch('/{id}')
  patchProfile() {
    throw new Error('not implemented')
  }

  @Delete('/{id}')
  deleteProfile(@Param('id') id) {
    if (!id) throw new ApiError('id is required')

    users = users.filter(user => user.id !== id)
  }

  @Get('/ctx')
  getCtx(@Context() ctx) {
    return ctx
  }
}