import pool from '../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; // Import jose

export async function POST(req) {
    const client = await pool.connect();

    try {
        const { id, password } = await req.json();

        // 1. Find User
        const result = await client.query(
            "SELECT * FROM users WHERE LOWER(user_id) = LOWER($1)",
            [id.trim()]
        );
        const user = result.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 2. Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        // 3. 🔥 GENERATE SECURE TOKEN (JWT)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({
            userId: user.user_id,
            role: user.role,
            name: user.name
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h') // Token valid for 24 hours
            .sign(secret);

        // 4. Create Response with Cookie
        const response = NextResponse.json({
            success: true,
            role: user.role,
            name: user.name
        });

        // Set HTTP-Only Cookie (Browser cannot access this via JS, very secure)
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    } finally {
        client.release();
    }
}