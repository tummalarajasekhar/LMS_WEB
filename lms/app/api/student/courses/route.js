import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const client = await pool.connect();
    try {
        // Fetch all active courses. 
        // In future, you can filter this by 'users_courses' enrollment table.
        const res = await client.query(
            "SELECT id, title, short_title, description, color, created_at FROM courses ORDER BY created_at DESC"
        );
        return NextResponse.json(res.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}