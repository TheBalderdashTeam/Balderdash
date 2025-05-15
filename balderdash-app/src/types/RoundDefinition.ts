export type RoundDefinition = {
    id: number;
    gameId: number;
    userId?: number;
    definition: string;
    wordId: number;
    submittedAt?: Date;
};
