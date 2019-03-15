"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var assert = require("assert");
var partyA = new index_1.Party({
    id: '1',
    electedMemberCount: 350,
    voteCount: 1000,
    partyListCandidateCount: 150,
});
var partyB = new index_1.Party({
    id: '2',
    electedMemberCount: 175,
    voteCount: 1000,
    partyListCandidateCount: 150,
});
var partyC = new index_1.Party({
    id: '3',
    electedMemberCount: 175,
    voteCount: 1000,
    partyListCandidateCount: 0,
});
var partyD = new index_1.Party({
    id: '4',
    electedMemberCount: 0,
    voteCount: 1,
    partyListCandidateCount: 150,
});
var partyE = new index_1.Party({
    id: '4',
    electedMemberCount: 251,
    voteCount: 1000,
    partyListCandidateCount: 150,
});
var partyF = new index_1.Party({
    id: '5',
    electedMemberCount: 99,
    voteCount: 1000,
    partyListCandidateCount: 150,
});
var partyG = new index_1.Party({
    id: '6',
    electedMemberCount: 175,
    voteCount: 1000,
    partyListCandidateCount: 150,
});
describe('Thailand Election Party List Calculation', function () {
    it('should pass monopoly case', function () {
        var parties = index_1.calculatePartyList([partyA]);
        assert.equal(parties.length, 1);
        assert.equal(parties[0].partyListMemberCount, 150);
    });
    it('should split equally between 2 parties', function () {
        var parties = index_1.calculatePartyList([partyB, partyG]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 75);
        assert.equal(parties[1].partyListMemberCount, 75);
    });
    it('should exclude parties not submitting candidate', function () {
        var parties = index_1.calculatePartyList([partyB, partyC]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 150);
        assert.equal(parties[1].partyListMemberCount, 0);
    });
    it('should exclude parties not reaching minimum votes', function () {
        var parties = index_1.calculatePartyList([partyB, partyD]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 150);
        assert.equal(parties[1].partyListMemberCount, 0);
    });
    it('should exclude vote no and invalid ballot', function () {
        var parties = index_1.calculatePartyList([partyB, partyG]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 75);
        assert.equal(parties[1].partyListMemberCount, 75);
    });
    it('should exclude party with exceeded elected members', function () {
        var parties = index_1.calculatePartyList([partyE, partyF]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 0);
        assert.equal(parties[1].partyListMemberCount, 150);
    });
});
