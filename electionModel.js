// FOR NODE.JS
// noinspection JSUnusedGlobalSymbols

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

    // FEATURE 2. Add a part.
    setNewCandidate(newCandidateName, newPartyName, newVotes) {
        if (
            !this.candidates.some((i) => i.candidateName === newCandidateName)
        ) {
            // The candidate doesn't exist in the electorate, so add them. candidateName is unique.
            const newCandidate = JSON.parse(
                JSON.stringify(
                    new Candidate(newCandidateName, newPartyName, newVotes)
                )
            );
            this.candidates.push(newCandidate);
        }
    }

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

    //FEATURE 4. Filter parts.
    getCandidatesByVoteThreshold(threshold) {
        return this.candidates.filter(
            (candidate) => candidate.votes >= threshold
        );
    }

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
    getLeadingCandidate() {
        const maxVotesValue = Math.max.apply(Math, this.candidates.map(function(candidate) { return candidate.votes; }));
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

console.log(testElectorate.getLeadingCandidate());
