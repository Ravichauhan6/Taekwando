import Database from "better-sqlite3";

const sqliteDb = new Database("mdta.db");
const categoryId = 68; // Based on previous observation
const matches = sqliteDb.prepare(`
      SELECT m.*, 
             p1.name as player1_name,
             p2.name as player2_name
      FROM matches m
      LEFT JOIN players p1 ON m.player1_id = p1.id
      LEFT JOIN players p2 ON m.player2_id = p2.id
      WHERE m.category_id = ?
      ORDER BY m.round_number DESC, m.match_number ASC
    `).all(categoryId);

console.log('Matches length:', matches.length);
if (matches.length > 0) {
    console.log(matches.slice(0, 5)); // print first 5 matches to see player names
}
