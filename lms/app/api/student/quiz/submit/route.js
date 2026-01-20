import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const client = await pool.connect();

    try {
        const { studentId, quizId, answers } = await req.json();

        // 1. Fetch the Quiz and Correct Answers from DB
        // We get the questions to compare answers
        const questionsRes = await client.query(
            "SELECT id, marks, correct_option FROM questions WHERE quiz_id = $1",
            [quizId]
        );
        const questions = questionsRes.rows;

        if (questions.length === 0) {
            return NextResponse.json({ error: "Quiz has no questions" }, { status: 400 });
        }

        // 2. Calculate Score
        let score = 0;
        let totalMarks = 0;

        questions.forEach(q => {
            totalMarks += q.marks;
            // Compare student's answer (index) with correct option (index)
            // Note: Make sure both are treated as integers
            if (answers[q.id] !== undefined && parseInt(answers[q.id]) === parseInt(q.correct_option)) {
                score += q.marks;
            }
        });

        // 3. Determine Pass/Fail (e.g., 40% to pass)
        const passed = (score / totalMarks) >= 0.4;

        // 4. Save Result to DB
        await client.query(
            `INSERT INTO quiz_results (student_id, quiz_id, score, total_marks, passed) 
       VALUES ($1, $2, $3, $4, $5)`,
            [studentId, quizId, score, totalMarks, passed]
        );

        return NextResponse.json({ success: true, score, totalMarks, passed });

    } catch (error) {
        console.error("Quiz Submit Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}