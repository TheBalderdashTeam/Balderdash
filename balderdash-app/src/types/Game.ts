export type Game = {
    id: number
    hostUserId: number
    numberRounds: number
    timeLimitSeconds: number
    lobbyCode: string
    startedAt: Date
    endedAt: Date
    statusId: number
}
