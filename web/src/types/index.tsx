
export interface IdeaRow {
    name: string;
    key: string;
    id: number;
    poolName: string;
    author: string;
    title: string;
    description: string;
    avg_impact: number;
    avg_confidence: number;
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


export interface Vote {
    impact: number;
    confidence: number;
    ease: number;
}