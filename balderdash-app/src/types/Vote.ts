export type Vote = {
    id: number;
    roundId: number;
    voterUserId: number;
    roundDefinitionId: number;
    isCorrect: boolean;
    votedAt: number;
};
