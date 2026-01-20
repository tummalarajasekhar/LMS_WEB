import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const client = await pool.connect();
    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get('id'); // Get ID from URL

    try {
        if (!instructorId) {
            return NextResponse.json({ error: "Instructor ID required" }, { status: 400 });
        }

        // 1. Get Course Count for THIS faculty
        const coursesRes = await client.query(
            "SELECT COUNT(*) FROM courses WHERE instructor_id = $1",
            [instructorId]
        );

        // 2. Get Total Students (Generic count for now)
        const studentsRes = await client.query(
            "SELECT COUNT(*) FROM users WHERE role = 'student'"
        );

        // 3. Get Recent Courses (Limit 5)
        const recentCoursesRes = await client.query(
            "SELECT * FROM courses WHERE instructor_id = $1 ORDER BY created_at DESC LIMIT 5",
            [instructorId]
        );

        return NextResponse.json({
            activeCourses: parseInt(coursesRes.rows[0].count),
            totalStudents: parseInt(studentsRes.rows[0].count),
            recentCourses: recentCoursesRes.rows
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}