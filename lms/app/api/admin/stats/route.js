import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const client = await pool.connect();
    try {
        // Run queries in parallel for speed
        const studentCount = await client.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
        const facultyCount = await client.query("SELECT COUNT(*) FROM users WHERE role = 'faculty'");
        const courseCount = await client.query("SELECT COUNT(*) FROM courses");

        return NextResponse.json({
            students: parseInt(studentCount.rows[0].count),
            faculty: parseInt(facultyCount.rows[0].count),
            courses: parseInt(courseCount.rows[0].count),
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}