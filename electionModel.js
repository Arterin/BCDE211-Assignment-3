// noinspection JSUnusedGlobalSymbols
// TODO rewrite in typescript with required features.
// FOR NODE.JS
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}
// FEATURE 13. Provide default values.
var STORAGE_KEY = "candidates";
// FEATURE 2. Add a part.
var Candidate = /** @class */ (function () {
    function Candidate(newCandidateName, newPartyName, newVotes, newPercentageOfVote) {
        if (newVotes === void 0) { newVotes = 0; }
        if (newPercentageOfVote === void 0) { newPercentageOfVote = 0; }
        this.candidateName = newCandidateName;
        this.partyName = newPartyName;
        this.votes = newVotes; // FEATURE 13. Provide default values.
        this.percentageOfVote = newPercentageOfVote;
    }
    ;
    return Candidate;
}());
// FEATURE 1. Create a whole that acts as a facade for parts.
var Electorate = /** @class */ (function () {
    function Electorate(newElectorateName) {
        this.electorateName = newElectorateName;
        this.candidates = [];
        // Following attributes are for supporting editing candidateName
        this.editedCandidateIndex = 0;
        this.beforeEditNameCache = "";
        this.totalVotes = 0;
    }
    ;
    // FEATURE 10. Validate inputs.
    // FEATURE 2. Add a part.
    Electorate.prototype.setNewCandidate = function (newCandidateName, newPartyName, newVotes, newPercentageOfVote) {
        var _this = this;
        if (newVotes === void 0) { newVotes = 0; }
        if (newPercentageOfVote === void 0) { newPercentageOfVote = 0; }
        if (!this.candidates.some(function (i) { return i.candidateName === newCandidateName &&
            !_this.candidates.some(function (i) { return i.partyName === newPartyName; }); })) {
            // The candidate doesn't exist in the electorate, so add them. candidateName and partyName are unique.
            var newCandidate = JSON.parse(JSON.stringify(new Candidate(newCandidateName, newPartyName, newVotes, newPercentageOfVote)));
            this.candidates.push(newCandidate);
            this.totalVotes += newVotes;
            this.updatePercentageOfVote();
        }
    };
    ;
    // TODO Separate sort by votes, separate sort alphabetically, sort by %age of votes.
    // FEATURE 3. Sort parts.
    Electorate.prototype.sortCandidatesByVoteCount = function () {
        // Sorts high to low by votes, sorts alphabetically by name if tied on votes.
        return this.candidates.sort(function (a, b) {
            return a.votes > b.votes
                ? -1
                : a.votes === b.votes
                    ? a.candidateName > b.candidateName
                        ? 1
                        : -1
                    : 1;
        });
    };
    ;
    // TODO filter by vote %age.
    // TODO one more filter.
    // FEATURE 4. Filter parts.
    Electorate.prototype.getCandidatesByVoteThreshold = function (threshold) {
        return this.candidates.filter(function (candidate) { return candidate.votes >= threshold; });
    };
    ;
    // TODO Feature 10, validate all inputs.
    // TODO Feature 11, calculation within a part, calculate vote %age of each candidate. have other methods call this one to update?
    // TODO Feature 14, search function. successful search. unsuccessful search.
    // FEATURE 11. Calculation within a part.
    Electorate.prototype.updatePercentageOfVote = function () {
        //this.totalVotes = this.candidates.reduce((a, c) => a + c.votes)
        var self = this;
        this.candidates.forEach(function (candidate) {
            candidate.percentageOfVote = (candidate.votes / self.totalVotes) * 100;
        });
    };
    ;
    // FEATURE 5. Delete a selected part.
    Electorate.prototype.deleteCandidate = function (targetCandidateName) {
        var index = this.candidates.findIndex(function (i) { return i.candidateName === targetCandidateName; });
        this.candidates.splice(index, 1);
    };
    ;
    // FEATURE 6. Save all parts to LocalStorage.
    Electorate.prototype.saveCandidates = function () {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.candidates));
    };
    ;
    // FEATURE 7. Load all parts from LocalStorage.
    Electorate.prototype.loadCandidates = function () {
        this.candidates = JSON.parse(localStorage.getItem(STORAGE_KEY));
    };
    ;
    // FEATURE 8. Update/edit a part. TODO validate input
    Electorate.prototype.startEditingCandidateName = function (toBeEditedCandidate) {
        this.editedCandidateIndex = this.candidates.findIndex(function (i) { return i.candidateName === toBeEditedCandidate; });
        this.beforeEditNameCache = toBeEditedCandidate;
    };
    ;
    // FEATURE 8. Update/edit a part.
    Electorate.prototype.finishEditingCandidateName = function (newCandidateName) {
        if (!this.candidates.some(function (i) { return i.candidateName === newCandidateName; })) {
            this.candidates[this.editedCandidateIndex].candidateName = newCandidateName;
        }
    };
    ;
    // FEATURE 8. Update/edit a part.
    Electorate.prototype.cancelEditingCandidateName = function () {
        this.editedCandidateIndex = 0;
        this.editedCandidateIndex = 0;
    };
    ;
    // FEATURE 9. Update/edit a part.
    Electorate.prototype.revertEditingCandidateName = function () {
        // Only reverts last name edited
        this.candidates[this.editedCandidateIndex].candidateName = this.beforeEditNameCache;
        this.editedCandidateIndex = 0;
        this.editedCandidateIndex = 0;
    };
    ;
    // FEATURE 12. A calculation across many parts.
    Electorate.prototype.getLeadingCandidates = function () {
        var maxVotesValue = Math.max.apply(Math, this.candidates.map(function (candidate) { return candidate.votes; }));
        return this.candidates.filter(function (candidate) { return candidate.votes === maxVotesValue; });
        // Returns array of candidate objects with the highest votes.
    };
    ;
    // FEATURE 15. Get all parts.
    Electorate.prototype.getAllCandidates = function () {
        return this.candidates;
    };
    ;
    return Electorate;
}());
module.exports = {
    Candidate: Candidate,
    Electorate: Electorate,
    STORAGE_KEY: STORAGE_KEY
};
