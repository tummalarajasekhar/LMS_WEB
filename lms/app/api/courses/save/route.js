import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    // 1. Open a specific client from the pool (needed for transactions)
    const client = await pool.connect();

    try {
        const body = await req.json();
        const { basics, sections } = body;

        console.log("Starting Transaction for Course:", basics.title);

        // 2. Start SQL Transaction
        await client.query('BEGIN');

        // --- STEP A: Insert Course ---
        // Note: We map camelCase (frontend) to snake_case (database)
        const courseRes = await client.query(
            `INSERT INTO courses (title, short_title, description, color) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
            [basics.title, basics.shortTitle, basics.description, basics.color]
        );
        const courseId = courseRes.rows[0].id;
        console.log(`Course Created: ID ${courseId}`);

        // --- STEP B: Loop through Sections ---
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            const sectionRes = await client.query(
                `INSERT INTO sections (course_id, title, section_order) 
         VALUES ($1, $2, $3) 
         RETURNING id`,
                [courseId, section.title, i + 1]
            );
            const sectionId = sectionRes.rows[0].id;

            // 1. Insert Topics (Videos/PDFs)
            for (const topic of section.topics) {
                await client.query(
                    `INSERT INTO topics (section_id, title, type, url) 
           VALUES ($1, $2, $3, $4)`,
                    [sectionId, topic.title, topic.type, topic.url || '']
                );
            }

            // 2. Insert Quiz (If it exists and is valid)
            // Check if user actually added questions
            if (section.quiz && section.quiz.questions && section.quiz.questions.length > 0) {
                const quizRes = await client.query(
                    `INSERT INTO quizzes (section_id, time_limit, retakes) 
           VALUES ($1, $2, $3) 
           RETURNING id`,
                    [sectionId, section.quiz.timeLimit, section.quiz.retakes]
                );
                const quizId = quizRes.rows[0].id;

                // Insert Questions for this Quiz
                for (const q of section.quiz.questions) {
                    await client.query(
                        `INSERT INTO questions (quiz_id, text, marks, correct_option, options) 
             VALUES ($1, $2, $3, $4, $5)`,
                        [
                            quizId,
                            q.text,
                            q.marks,
                            q.correct,
                            JSON.stringify(q.options) // Convert Array -> JSON String
                        ]
                    );
                }
            }

            // 3. Insert Assignments
            for (const ass of section.assignments) {
                await client.query(
                    `INSERT INTO assignments (section_id, title, type, problem, marks, test_cases) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        sectionId,
                        ass.title,
                        ass.type,
                        ass.problem,
                        ass.marks,
                        JSON.stringify(ass.testCases) // Convert Array -> JSON String
                    ]
                );
            }
        }

        // --- STEP C: Commit Transaction ---
        await client.query('COMMIT');
        console.log("Transaction Committed Successfully");

        return NextResponse.json({ success: true, courseId }, { status: 201 });

    } catch (error) {
        // --- STEP D: Rollback (Undo if Error) ---
        await client.query('ROLLBACK');
        console.error("SQL Transaction Failed:", error);

        return NextResponse.json(
            { success: false, error: "Failed to save course. " + error.message },
            { status: 500 }
        );
    } finally {
        // Always release the client back to the pool
        client.release();
    }
}