
export interface Action {
    type: string; //addpool, addidea, costvote
    contextId: any;
}
export interface IdeaRow {
    key: string; // added later on the flight
    id: number;

    pool_name: string;
    author: string;
    title: string;
    description: string;

    avg_impact: number;
    avg_confidence: number;
    avg_ease: number;
    score: number;
    total_votes: number;
}

export interface IdeaRowForm {
    title: string;
    description: string;
}

export interface PoolRow {
    pool_name: string;
    author: string;
}

export interface PoolRowForm {
    name: string;
}

export interface VoteRow {
    ideaId: number;
    voter: string;
    impact: number;
    confidence: number;
    ease: number;
}


export interface VoteForm {
    impact: number;
    confidence: number;
    ease: number;
}