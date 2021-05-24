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
    constructor(newCandidateName, newPartyName, newVotes = 0) {
        this.candidateName = newCandidateName;
        this.partyName = newPartyName;
        this.votes = newVotes; // FEATURE 13. Provide default values.
    }
}

// FEATURE 1. Create a whole that acts as a facade for parts.
class Electorate {
    constructor(newElectorateName) {
        this.electorateName = newElectorateName;
        this.candidates = [];
        // Following attributes are for supporting editing candidateName
        this.editedCandidateIndex = null;
        this.beforeEditNameCache = "";
    }

    // FEATURE 10. Validate inputs.
    // FEATURE 2. Add a part.
    setNewCandidate(newCandidateName, newPartyName, newVotes) {
        if (!this.candidates.some((i) => i.candidateName === newCandidateName &&
            !this.candidates.some((i) => i.partyName === newPartyName))) {
            // The candidate doesn't exist in the electorate, so add them. candidateName and partyName are unique.
            const newCandidate = JSON.parse(
                JSON.stringify(
                    new Candidate(newCandidateName, newPartyName, newVotes)
                )
            );
            this.candidates.push(newCandidate);
        }
    }

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
    }

    // TODO Two more filters. filter by vote %age.
    // FEATURE 4. Filter parts.
    getCandidatesByVoteThreshold(threshold) {
        return this.candidates.filter(
            (candidate) => candidate.votes >= threshold
        );
    }

    // TODO Feature 10, validate all inputs.
    // TODO Feature 11, calculation within a part, calculate vote %age of each candidate. have other methods call this one to update?
    // TODO Feature 14, search function. successful search. unsuccessful search.

    // FEATURE 5. Delete a selected part.
    deleteCandidate(targetCandidateName) {
        const index = this.candidates.findIndex(
            (i) => i.candidateName === targetCandidateName
        );
        this.candidates.splice(index, 1);
    }

    // FEATURE 6. Save all parts to LocalStorage.
    saveCandidates() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.candidates));
    }

    // FEATURE 7. Load all parts from LocalStorage.
    loadCandidates() {
        this.candidates = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }

    // FEATURE 8. Update/edit a part. TODO validate input
    startEditingCandidateName(toBeEditedCandidate) {
        this.editedCandidateIndex = this.candidates.findIndex(
            (i) => i.candidateName === toBeEditedCandidate
        );
        this.beforeEditNameCache = toBeEditedCandidate;
    }

    // FEATURE 8. Update/edit a part.
    finishEditingCandidateName(newCandidateName) {
        if (
            !this.candidates.some((i) => i.candidateName === newCandidateName)
        ) {
            this.candidates[
                this.editedCandidateIndex
            ].candidateName = newCandidateName;
        }
    }

    // FEATURE 8. Update/edit a part.
    cancelEditingCandidateName() {
        this.editedCandidateIndex = null;
        this.editedCandidateIndex = null;
    }

    // FEATURE 9. Update/edit a part.
    revertEditingCandidateName() {
        // Only reverts last name edited
        this.candidates[
            this.editedCandidateIndex
        ].candidateName = this.beforeEditNameCache;
        this.editedCandidateIndex = null;
        this.editedCandidateIndex = null;
    }

    // FEATURE 12. A calculation across many parts.
    getLeadingCandidates() {
        const maxVotesValue = Math.max.apply(Math, this.candidates.map(function(candidate){ return candidate.votes; }));
        return this.candidates.filter(function(candidate){ return candidate.votes === maxVotesValue; })
        // Returns array of candidate objects with the highest votes.
    }

    // FEATURE 15. Get all parts.
    getAllCandidates() {
        return this.candidates;
    }

}

module.exports = {
    Candidate: Candidate,
    Electorate: Electorate,
    STORAGE_KEY: STORAGE_KEY
};

// Debugging
testElectorate = new Electorate("test electorate");
testElectorate.setNewCandidate("bob", "party time", 300);
testElectorate.setNewCandidate("tim", "not party time", 600);
testElectorate.setNewCandidate("tam", "not party time 2", 600);

console.log(testElectorate.getLeadingCandidates());
