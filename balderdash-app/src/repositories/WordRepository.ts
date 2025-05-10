import sql from '../configuration/DatabaseConfig';
import { Word } from '../types/Word';

export class WordRepository {
    static async getWordById(wordId: number): Promise<Word> {
        const [wordRow] = await sql`
      SELECT id, word, definition 
      FROM words
      WHERE id = ${wordId}
      LIMIT 1
    `;
        const wordDefinition: Word = {
            id: wordRow.id,
            word: wordRow.word,
            definition: wordRow.definition,
        };
        return wordDefinition;
    }

    static async getRandomWord() {
        const [wordRow] = await sql`
      SELECT id, word, definition 
      FROM words
      ORDER BY RANDOM()
      LIMIT 1
    `;
        const wordDefinition: Word = {
            id: wordRow.id,
            word: wordRow.word,
            definition: wordRow.definition,
        };
        return wordDefinition;
    }
}
