import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECREET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Check if user exists, if not create a new user
    let user = await db.select().from(users).where(eq(users.address, address)).limit(1);
    
    if (user.length === 0) {
      const [newUser] = await db.insert(users).values({ address }).returning();
      user = [newUser];
    }

    // Create a JWT token
    const token = jwt.sign({ address: user[0].address, id: user[0].id }, JWT_SECRET, { expiresIn: '1d' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    return NextResponse.json({ msg: "HELLO" });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}