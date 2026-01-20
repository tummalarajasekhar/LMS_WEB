import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const client = await pool.connect();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('id');

  try {
    if (!courseId) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // 1. Get Course Basics
    const courseRes = await client.query("SELECT * FROM courses WHERE id = $1", [courseId]);
    if (courseRes.rows.length === 0) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    const course = courseRes.rows[0];

    // 2. Get Sections
    const sectionsRes = await client.query(
      "SELECT * FROM sections WHERE course_id = $1 ORDER BY section_order ASC",
      [courseId]
    );
    const sections = sectionsRes.rows;

    // 3. Fetch Content for EACH Section (Topics, Quiz, Assignments)
    const sectionsWithData = await Promise.all(sections.map(async (section) => {

      // A. Fetch Topics
      const topicsRes = await client.query(
        "SELECT * FROM topics WHERE section_id = $1 ORDER BY id ASC",
        [section.id]
      );

      // B. Fetch Assignments
      const assignmentsRes = await client.query(
        "SELECT * FROM assignments WHERE section_id = $1 ORDER BY id ASC",
        [section.id]
      );

      // C. Fetch Quiz (If exists)
      const quizRes = await client.query(
        "SELECT * FROM quizzes WHERE section_id = $1",
        [section.id]
      );

      let quiz = null;
      if (quizRes.rows.length > 0) {
        quiz = quizRes.rows[0];
        // Fetch Questions for this Quiz
        const questionsRes = await client.query(
          "SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id ASC",
          [quiz.id]
        );
        quiz.questions = questionsRes.rows;
      }

      return {
        ...section,
        topics: topicsRes.rows,
        assignments: assignmentsRes.rows,
        quiz: quiz
      };
    }));

    return NextResponse.json({ course, sections: sectionsWithData });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}