import { WordRepository } from '../repositories/WordRepository';
import { Word } from '../types/Word';

export class WordService {
    static async getWordById(wordId: number) {
        const word = await WordRepository.getWordById(wordId);

        return word;
    }
    static async getRandomWord(): Promise<Word | null> {
        const word = await WordRepository.getRandomWord();

        return word;
    }
}
