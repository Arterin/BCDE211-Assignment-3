/* globals describe it xdescribe xit beforeEach expect TodoList localStorage STORAGE_KEY */
// noinspection JSUnresolvedVariable,JSUndeclaredVariable

let expect = require("chai").expect;
let Electorate = require("../electionModel.js").Electorate;
let STORAGE_KEY = require("../electionModel.js").STORAGE_KEY;
let LocalStorage = require("node-localstorage").LocalStorage;

describe("electionModel", function () {
    beforeEach(function () {
        theElectorate = new Electorate("testElectorate");
        localStorage = new LocalStorage("./storage");
    });

    // FEATURE 1. Create a whole that acts as a facade for parts.
    // FEATURE 2. Add a part.
    describe("setNewCandidate", function () {
        describe("A single candidate is added.", function () {
            beforeEach(function () {
                theElectorate.setNewCandidate("bob", "testParty", 1);
                theCandidate = theElectorate.candidates[0];
            });

            describe("The single candidate added.", function () {
                it("Should have the correst name.", function () {
                    expect(theCandidate.candidateName).to.equal("bob");
                });

                it("Should have the correct partyName.", function () {
                    expect(theCandidate.partyName).to.equal("testParty");
                });

                it("Should have correct votes.", function () {
                    expect(theCandidate.votes).to.equal(1);
                });
            });

            describe("The candidates list.", function () {
                it("Should have one entry.", function () {
                    expect(theElectorate.candidates.length).to.equal(1);
                });
            });
        });

        describe("When three candidates are added.", function () {
            it("Candidates list should have three entries.", function () {
                theElectorate.setNewCandidate("bink", "testParty1", 1);
                theElectorate.setNewCandidate("bonk", "testParty2", 2);
                theElectorate.setNewCandidate("bosh", "testParty3", 3);
                expect(theElectorate.candidates.length).to.equal(3);
            });
        });
    });

    // FEATURE 6. Save all parts to LocalStorage
    describe("saveCandidates", function () {
        beforeEach(function () {
            localStorage.clear();
            theElectorate.setNewCandidate("blub", "testParty1", 100);
            theElectorate.saveCandidates();
        });

        it("Should save a candidate from storage when there is one candidate.", function () {
            let electorateJSON = localStorage.getItem(STORAGE_KEY);
            expect(electorateJSON).to.exist;
        });

        it("Should have the correct JSON for the saved candidate in localStorage.", function () {
            let electorateJSON = localStorage.getItem(STORAGE_KEY);
            expect(electorateJSON).to.equal(
                '[{"candidateName":"blub","partyName":"testParty1","votes":100}]'
            );
        });
    });

    // FEATURE 7. Load all parts from LocalStorage.
    describe("loadCandidates", function () {
        beforeEach(function () {
            localStorage.clear();
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.saveCandidates();
        });

        it("Should load a candidate from localstorage when it has a single candidat.", function () {
            // New blank electorate.
            theElectorate2 = new Electorate("testElectorate");
            // Load.
            theElectorate2.loadCandidates();
            let loadedCandidates = theElectorate2.candidates;
            expect(loadedCandidates.length).to.equal(1);
        });

        it("Should have the correct array for the loaded candidate in .candidates.", function () {
            // New blank electorate.
            // noinspection JSUndeclaredVariable
            theElectorate3 = new Electorate("testElectorate");
            // Load.
            theElectorate3.loadCandidates();
            candidatesJSON = theElectorate3.candidates;
            expect(candidatesJSON).to.deep.equal([
                { candidateName: "tim", partyName: "testParty1", votes: 100 }
            ]);
        });
    });

    // FEATURE 3. Sort parts.
    describe("sortCandidatesByVoteCount", function () {
        it("Should sort candidates by vote count, high to low.", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.setNewCandidate("tam", "testParty2", 101);
            theElectorate.setNewCandidate("tom", "testParty3", 1000);
            actualOrderCandidates = theElectorate.sortCandidatesByVoteCount();
            expectedOrderCandidates = [
                { candidateName: "tom", partyName: "testParty3", votes: 1000 },
                { candidateName: "tam", partyName: "testParty2", votes: 101 },
                { candidateName: "tim", partyName: "testParty1", votes: 100 }
            ];
            expect(actualOrderCandidates).to.deep.equal(
                expectedOrderCandidates
            );
        });

        it("Should sort by name alphabetically in case of a tie in votes.", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.setNewCandidate("tam", "testParty2", 101);
            theElectorate.setNewCandidate("tom", "testParty3", 1000);
            theElectorate.setNewCandidate("atim", "testParty1", 100);
            actualOrderCandidates = theElectorate.sortCandidatesByVoteCount();
            expectedOrderCandidates = [
                { candidateName: "tom", partyName: "testParty3", votes: 1000 },
                { candidateName: "tam", partyName: "testParty2", votes: 101 },
                { candidateName: "atim", partyName: "testParty1", votes: 100 },
                { candidateName: "tim", partyName: "testParty1", votes: 100 }
            ];
            expect(actualOrderCandidates).to.deep.equal(
                expectedOrderCandidates
            );
        });

        it("Should return all of the candidates.")
    });

    // FEATURE 4. Filter parts.
    describe("getCandidatesByVoteThreshold", function () {
        it("Should filter candidates who do not meet or exceed the vote threshold out.", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 1058);
            theElectorate.setNewCandidate("tam", "testParty2", 51);
            theElectorate.setNewCandidate("tom", "testParty3", 50);
            theElectorate.setNewCandidate("atim", "testParty1", 0);
            theElectorate.setNewCandidate("xtim", "testParty1", 49);
            expectedOrderFilteredCandidates = [
                { candidateName: "tim", partyName: "testParty1", votes: 1058 },
                { candidateName: "tam", partyName: "testParty2", votes: 51 },
                { candidateName: "tom", partyName: "testParty3", votes: 50 }
            ];
            actualOrderFilteredCandidates = theElectorate.getCandidatesByVoteThreshold(
                50
            );
            expect(actualOrderFilteredCandidates).to.deep.equal(
                expectedOrderFilteredCandidates
            );
        });

        it("TODO expand on this")
    });

    describe("getLeadingCandidate", function () {
        beforeEach(function () {
            theElectorate.setNewCandidate("tim", "testParty1", 1058);
            theElectorate.setNewCandidate("tam", "testParty2", 51);
            theElectorate.setNewCandidate("tom", "testParty3", 50);
        });

        it("Should return the candidate onject with the most votes.", function () {
            expectedResult = {
                candidateName: "tim",
                partyName: "testParty1",
                votes: 1058
            };
            actualResult = theElectorate.getLeadingCandidate();
            expect(actualResult).to.deep.equal(expectedResult);
        });

        it("In case of tie returns all candidates tied for first place.");
    });
});
