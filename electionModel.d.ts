declare const STORAGE_KEY = "candidates";
declare class Candidate {
    private candidateName;
    private partyName;
    private votes;
    private percentageOfVote;
    constructor(newCandidateName: any, newPartyName: any, newVotes?: number, newPercentageOfVote?: number);
}
declare class Electorate {
    private candidates;
    private electorateName;
    private editedCandidateIndex;
    private beforeEditNameCache;
    private totalVotes;
    constructor(newElectorateName: any);
    setNewCandidate(newCandidateName: any, newPartyName: any, newVotes?: number, newPercentageOfVote?: number): void;
    sortCandidatesByVoteCount(): any[];
    getCandidatesByVoteThreshold(threshold: any): any[];
    getCandidatesByVotePercentage(threshold: any): void;
    updatePercentageOfVote(): void;
    deleteCandidate(targetCandidateName: any): void;
    saveCandidates(): void;
    loadCandidates(): void;
    startEditingCandidateName(toBeEditedCandidate: any): void;
    finishEditingCandidateName(newCandidateName: any): void;
    cancelEditingCandidateName(): void;
    revertEditingCandidateName(): void;
    getLeadingCandidates(): any[];
    getAllCandidates(): any[];
}
