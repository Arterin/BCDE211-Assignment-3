// noinspection JSUnusedGlobalSymbols


// TODO rewrite in typescript with required features.
// FOR NODE.JS
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

// FEATURE 13. Provide default values.
const STORAGE_KEY = "candidates";

// FEATURE 2. Add a part.
class Candidate {
    private candidateName: string;
    private partyName: string;
    // TODO int or number?
    private votes: number;
    // TODO check if this would be better as a float or something
    private percentageOfVote: number;

    constructor(newCandidateName: string, newPartyName: string, newVotes = 0, newPercentageOfVote = 0) {
        this.candidateName = newCandidateName;
        this.partyName = newPartyName;
        this.votes = newVotes; // FEATURE 13. Provide default values.
        this.percentageOfVote = newPercentageOfVote;
    };
}

// FEATURE 1. Create a whole that acts as a facade for parts.
class Electorate {
    // TODO look into array types and give this array an appropriate type.
    private candidates: any[];
    private electorateName: string;
    private editedCandidateIndex: number;
    private beforeEditNameCache: string;
    private totalVotes: number;

    constructor(newElectorateName: string) {
        this.electorateName = newElectorateName;
        this.candidates = [];
        // Following attributes are for supporting editing candidateName
        this.editedCandidateIndex = 0;
        this.beforeEditNameCache = "";
        this.totalVotes = 0;
    };

    // FEATURE 10. Validate inputs.
    // FEATURE 2. Add a part.
    setNewCandidate(newCandidateName: string, newPartyName: string, newVotes = 0, newPercentageOfVote = 0) {
        if (!this.candidates.some((i) => i.candidateName === newCandidateName &&
            !this.candidates.some((i) => i.partyName === newPartyName))) {
            // The candidate doesn't exist in the electorate, so add them. candidateName and partyName are unique.
            const newCandidate = JSON.parse(
                JSON.stringify(
                    new Candidate(newCandidateName, newPartyName, newVotes, newPercentageOfVote)
                )
            );
            this.candidates.push(newCandidate);
            this.totalVotes += newVotes;
            this.updatePercentageOfVote();
        }
    };

    // TODO Separate sort by votes, separate sort alphabetically, sort by %age of votes.
    // FEATURE 3. Sort parts.
    sortCandidatesByVoteCount() {
        // Sorts high to low by votes, sorts alphabetically by name if tied on votes.
        return this.candidates.sort((a, b) =>
            a.votes > b.votes
                ? -1
                : a.votes === b.votes
                ? a.candidateName > b.candidateName
                    ? 1
                    : -1
                : 1
        );
    };

    // TODO filter by vote %age.
    // TODO one more filter.
    // FEATURE 4. Filter parts.
    getCandidatesByVoteThreshold(threshold: number) {
        return this.candidates.filter(
            (candidate) => candidate.votes >= threshold
        );
    };

    // TODO Feature 10, validate all inputs.
    // TODO Feature 11, calculation within a part, calculate vote %age of each candidate. have other methods call this one to update?
    // TODO Feature 14, search function. successful search. unsuccessful search.

    // FEATURE 11. Calculation within a part.
    updatePercentageOfVote() {
        //this.totalVotes = this.candidates.reduce((a, c) => a + c.votes)
        let self = this;
        this.candidates.forEach(function(candidate){
            candidate.percentageOfVote = (candidate.votes / self.totalVotes)*100;
        });
    };

    // FEATURE 5. Delete a selected part.
    deleteCandidate(targetCandidateName: string) {
        const index = this.candidates.findIndex(
            (i) => i.candidateName === targetCandidateName
        );
        this.candidates.splice(index, 1);
    };

    // FEATURE 6. Save all parts to LocalStorage.
    saveCandidates() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.candidates));
    };

    // FEATURE 7. Load all parts from LocalStorage.
    loadCandidates() {
        this.candidates = JSON.parse(<string>localStorage.getItem(STORAGE_KEY));
    };

    // FEATURE 8. Update/edit a part. TODO validate input
    startEditingCandidateName(toBeEditedCandidate: string) {
        this.editedCandidateIndex = this.candidates.findIndex(
            (i) => i.candidateName === toBeEditedCandidate
        );
        this.beforeEditNameCache = toBeEditedCandidate;
    };

    // FEATURE 8. Update/edit a part.
    finishEditingCandidateName(newCandidateName: string) {
        if (
            !this.candidates.some((i) => i.candidateName === newCandidateName)
        ) {
            this.candidates[
                this.editedCandidateIndex
                ].candidateName = newCandidateName;
        }
    };

    // FEATURE 8. Update/edit a part.
    cancelEditingCandidateName() {
        this.editedCandidateIndex = 0;
        this.editedCandidateIndex = 0;
    };

    // FEATURE 9. Update/edit a part.
    revertEditingCandidateName() {
        // Only reverts last name edited
        this.candidates[
            this.editedCandidateIndex
            ].candidateName = this.beforeEditNameCache;
        this.editedCandidateIndex = 0;
        this.editedCandidateIndex = 0;
    };

    // FEATURE 12. A calculation across many parts.
    getLeadingCandidates() {
        const maxVotesValue = Math.max.apply(Math, this.candidates.map(function(candidate){ return candidate.votes; }));
        return this.candidates.filter(function(candidate){ return candidate.votes === maxVotesValue; })
        // Returns array of candidate objects with the highest votes.
    };

    // FEATURE 15. Get all parts.
    getAllCandidates() {
        return this.candidates;
    };

}

module.exports = {
    Candidate: Candidate,
    Electorate: Electorate,
    STORAGE_KEY: STORAGE_KEY
};
