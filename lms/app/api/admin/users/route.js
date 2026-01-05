import pool from '../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // IMPORT THIS

// 1. GET ALL USERS (No Change)
export async function GET() {
    const client = await pool.connect();
    try {
        const res = await client.query(
            "SELECT id, user_id, name, role, branch FROM users WHERE role != 'admin' ORDER BY created_at DESC"
        );
        return NextResponse.json(res.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}

// 2. ADD NEW USER (NOW WITH HASHING)
export async function POST(req) {
    const client = await pool.connect();
    try {
        const { userId, name, role, branch, password } = await req.json();

        // Determine plain text password
        const plainPassword = password && String(password).trim() !== ''
            ? String(password)
            : 'Welcome@123';

        // 🔥 HASHING STEP: Scramble the password with 10 rounds of salt
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Save the HASHED password, not the plain one
        const res = await client.query(
            "INSERT INTO users (user_id, name, role, branch, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, name, role, branch, hashedPassword]
        );

        return NextResponse.json(res.rows[0], { status: 201 });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "User ID already exists" }, { status: 500 });
    } finally {
        client.release();
    }
}

// 3. DELETE USER (No Change)
export async function DELETE(req) {
    const client = await pool.connect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await client.query("DELETE FROM users WHERE id = $1", [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}