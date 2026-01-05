import pool from '../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
    const hashedPassword = await bcrypt.hash('admin123', 10); // Password is 'admin123'
    const client = await pool.connect();

    await client.query("DELETE FROM users WHERE user_id = 'admin'");
    await client.query(
        "INSERT INTO users (user_id, password, name, role) VALUES ('admin', $1, 'System Admin', 'admin')",
        [hashedPassword]
    );

    client.release();
    return NextResponse.json({ msg: "Admin Reset. User: admin, Pass: admin123" });
}