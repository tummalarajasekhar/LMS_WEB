import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const client = await pool.connect();
    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get('id');

    try {
        if (!instructorId) return NextResponse.json([], { status: 400 });

        const res = await client.query(
            "SELECT * FROM courses WHERE instructor_id = $1 ORDER BY created_at DESC",
            [instructorId]
        );

        return NextResponse.json(res.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}