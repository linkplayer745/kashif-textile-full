import jwt from 'jsonwebtoken';
import moment from 'moment';
import { config } from '../config/config';

export interface AccessTokenPayload {
  sub: string;
  agencyId?: string;
  role?: string;
  iat: number;
  exp: number;
  type: 'access';
}
function generateAccessToken(userId: string, role: string = 'user'): string {
  const expiresAt = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

  const payload: AccessTokenPayload = {
    sub: userId,
    role,
    iat: moment().unix(),
    exp: expiresAt.unix(),
    type: 'access',
  };

  return jwt.sign(payload, config.jwt.secret);
}

function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, config.jwt.secret);
  return decoded as AccessTokenPayload;
}

export default {
  generateAccessToken,
  verifyAccessToken,
};
