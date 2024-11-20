import { NextResponse } from 'next/server';
import redis from './redis';

export async function rateLimit(ip: string): Promise<{
  success: boolean;
  remaining: number;
}> {
  const key = `rate_limit:${ip}`;
  const limit = 3;
  const window = 3600; // 1 hour in seconds

  const multi = redis.multi();
  multi.incr(key);
  multi.expire(key, window);
  
  const [count] = await multi.exec() as [number, any];
  const remaining = Math.max(0, limit - count);

  return {
    success: count <= limit,
    remaining,
  };
}