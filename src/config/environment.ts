import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `${process.cwd()}/.env`,
});

export const getMongoUrl = () => {
  let mongoUrl = '';
  if (process.env.MONGOOSE_URI) {
    mongoUrl = `${process.env.MONGOOSE_URI}`;
  }
  console.log('🚀 ~ getMongoUrl ~ mongoUrl:', mongoUrl);
  return mongoUrl;
};
export const JwtSecret = process.env.JWT_SECRET;
export const rootPublicPath = join(__dirname, '../../', 'file');
