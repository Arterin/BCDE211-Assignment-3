"use strict";
exports.__esModule = true;
/* globals describe it xdescribe xit beforeEach expect TodoList localStorage STORAGE_KEY */
// noinspection JSUnresolvedVariable
require("jasmine");
var Electorate_module = require("../electionModel.js").Electorate;
var STORAGE_KEY_module = require("../electionModel.js").STORAGE_KEY;
var LocalStorage = require("node-localstorage").LocalStorage;
// fs is a node.js module.
var fs = require('fs');
var storageFile = "./storage/candidates";
var theElectorate;
var localStorage;
var theCandidate;
var theElectorate2;
var theElectorate3;
describe("electionModel", function () {
    beforeEach(function () {
        theElectorate = new Electorate_module("testElectorate");
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
                it("Should have the correct name.", function () {
                    expect(theCandidate.candidateName).toEqual("bob");
                });
                it("Should have the correct partyName.", function () {
                    expect(theCandidate.partyName).toEqual("testParty");
                });
                it("Should have correct votes.", function () {
                    expect(theCandidate.votes).toEqual(1);
                });
            });
            describe("The candidates list.", function () {
                it("Should have one entry.", function () {
                    expect(theElectorate.candidates.length).toEqual(1);
                });
            });
        });
        describe("When three candidates are added.", function () {
            it("Candidates list should have three entries.", function () {
                theElectorate.setNewCandidate("bink", "testParty1", 1);
                theElectorate.setNewCandidate("bonk", "testParty2", 2);
                theElectorate.setNewCandidate("bosh", "testParty3", 3);
                expect(theElectorate.candidates.length).toEqual(3);
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
            // fs is a node.js module.
            expect(fs.existsSync(storageFile)).toBe(true);
        });
        it("Should have the correct JSON for the saved candidate in localStorage.", function () {
            var electorateJSON = localStorage.getItem(STORAGE_KEY_module);
            expect(electorateJSON).toEqual('[{"candidateName":"blub","partyName":"testParty1","votes":100,"percentageOfVote":100}]');
        });
    });
    // FEATURE 7. Load all parts from LocalStorage.
    describe("loadCandidates", function () {
        beforeEach(function () {
            localStorage.clear();
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.saveCandidates();
        });
        it("Should load a candidate from localstorage when it has a single candidate.", function () {
            // New blank electorate.
            theElectorate2 = new Electorate_module("testElectorate");
            // Load.
            theElectorate2.loadCandidates();
            var loadedCandidates = theElectorate2.candidates;
            expect(loadedCandidates.length).toEqual(1);
        });
        it("Should have the correct array for the loaded candidate in .candidates.", function () {
            // New blank electorate.
            // noinspection JSUndeclaredVariable
            theElectorate3 = new Electorate_module("testElectorate");
            // Load.
            theElectorate3.loadCandidates();
            var candidatesJSON = theElectorate3.candidates;
            expect(candidatesJSON).toEqual([
                { candidateName: "tim", partyName: "testParty1", votes: 100, percentageOfVote: 100 }
            ]);
        });
    });
    // FEATURE 3. Sort parts.
    describe("sortCandidatesByVoteCount", function () {
        it("Should sort candidates by vote count, high to low.", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.setNewCandidate("tam", "testParty2", 200);
            theElectorate.setNewCandidate("tom", "testParty3", 700);
            var actualOrderCandidates = theElectorate.sortCandidatesByVoteCount();
            var expectedOrderCandidates = [
                { candidateName: "tom", partyName: "testParty3", votes: 700, percentageOfVote: 70 },
                { candidateName: "tam", partyName: "testParty2", votes: 200, percentageOfVote: 20 },
                { candidateName: "tim", partyName: "testParty1", votes: 100, percentageOfVote: 10 }
            ];
            expect(actualOrderCandidates).toEqual(expectedOrderCandidates);
        });
        it("Should sort by name alphabetically in case of a tie in votes.", function () {
            theElectorate.setNewCandidate("tim", "testParty4", 100);
            theElectorate.setNewCandidate("tam", "testParty2", 500);
            theElectorate.setNewCandidate("tom", "testParty3", 300);
            theElectorate.setNewCandidate("atim", "testParty1", 100);
            var actualOrderCandidates = theElectorate.sortCandidatesByVoteCount();
            var expectedOrderCandidates = [
                { candidateName: "tam", partyName: "testParty2", votes: 500, percentageOfVote: 50 },
                { candidateName: "tom", partyName: "testParty3", votes: 300, percentageOfVote: 30 },
                { candidateName: "atim", partyName: "testParty1", votes: 100, percentageOfVote: 10 },
                { candidateName: "tim", partyName: "testParty4", votes: 100, percentageOfVote: 10 }
            ];
            expect(actualOrderCandidates).toEqual(expectedOrderCandidates);
        });
        it("Should return all of the candidates.");
    });
    // FEATURE 4. Filter parts.
    describe("getCandidatesByVoteThreshold", function () {
        it("Should filter candidates who do not meet or exceed the vote threshold out.", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 400);
            theElectorate.setNewCandidate("tam", "testParty2", 300);
            theElectorate.setNewCandidate("tom", "testParty3", 200);
            theElectorate.setNewCandidate("atim", "testParty1", 0);
            theElectorate.setNewCandidate("xtim", "testParty1", 100);
            var expectedOrderFilteredCandidates = [
                { candidateName: "tim", partyName: "testParty1", votes: 400, percentageOfVote: 40 },
                { candidateName: "tam", partyName: "testParty2", votes: 300, percentageOfVote: 30 },
                { candidateName: "tom", partyName: "testParty3", votes: 200, percentageOfVote: 20 }
            ];
            var actualOrderFilteredCandidates = theElectorate.getCandidatesByVoteThreshold(200);
            expect(actualOrderFilteredCandidates).toEqual(expectedOrderFilteredCandidates);
        });
        it("TODO expand on this");
    });
    // FEATURE 12. A calculation across many parts.
    describe("getLeadingCandidate", function () {
        it("Should return an array of candidate objects with the most votes.", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 400);
            theElectorate.setNewCandidate("tam", "testParty2", 300);
            theElectorate.setNewCandidate("tom", "testParty3", 200);
            theElectorate.setNewCandidate("tum", "testParty4", 100);
            var expectedResult = [{
                    candidateName: "tim",
                    partyName: "testParty1",
                    votes: 400,
                    percentageOfVote: 40
                }];
            var actualResult = theElectorate.getLeadingCandidates();
            expect(actualResult).toEqual(expectedResult);
        });
        it("In case of tie returns array of all candidates tied for first place.", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 400);
            theElectorate.setNewCandidate("tam", "testParty2", 400);
            theElectorate.setNewCandidate("tom", "testParty3", 200);
            var expectedResult = [{
                    candidateName: "tim",
                    partyName: "testParty1",
                    votes: 400,
                    percentageOfVote: 40
                }, {
                    candidateName: "tam",
                    partyName: "testParty2",
                    votes: 400,
                    percentageOfVote: 40
                }];
            var actualResult = theElectorate.getLeadingCandidates();
            expect(actualResult).toEqual(expectedResult);
        });
    });
    describe("updatePercentageOfVote", function () {
        beforeEach(function () {
            theElectorate.setNewCandidate("tim", "testParty1", 500);
            theElectorate.setNewCandidate("tam", "testParty2", 300);
            theElectorate.setNewCandidate("tom", "testParty3", 100);
            theElectorate.setNewCandidate("tum", "testParty4", 100);
        });
        it('should correctly assign the percentage of votes', function () {
            var expectedResult = 50;
            theElectorate.updatePercentageOfVote();
            var actualResult = theElectorate.candidates[0].percentageOfVote;
            expect(actualResult).toEqual(expectedResult);
        });
    });
});
