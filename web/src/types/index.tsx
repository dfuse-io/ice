
export interface IdeaRow {
    Id: number;
    poolName: string;
    author: string;
    description: string;
    avgImpact: number;
    avgConfidence: number;
    avg_ease: number;
    score: number;
    total_votes: number;
}

export interface PoolRow {
    pool_name: string;
    author: string;
    description: string
}

export interface VoteRow {
    ideaId: number;
    voter: string;
    impact: number;
    confidence: number;
    ease: number;
}
