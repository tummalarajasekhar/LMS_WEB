import pool from '../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// ✅ CORRECT: Named export 'POST'
export async function POST(req) {
    const client = await pool.connect();

    try {
        const { id, password } = await req.json();

        // 1. Find User (Case insensitive)
        const result = await client.query(
            "SELECT * FROM users WHERE LOWER(user_id) = LOWER($1)",
            [id.trim()]
        );

        const user = result.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        // 3. Success
        return NextResponse.json({
            success: true,
            role: user.role,
            name: user.name
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    } finally {
        client.release();
    }
}