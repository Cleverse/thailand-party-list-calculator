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
var partyH = new index_1.Party({
    id: '7',
    electedMemberCount: 31,
    voteCount: 1040,
    partyListCandidateCount: 40,
});
var partyI = new index_1.Party({
    id: '8',
    electedMemberCount: 15,
    voteCount: 700,
    partyListCandidateCount: 34,
});
var partyJ = new index_1.Party({
    id: '9',
    electedMemberCount: 38,
    voteCount: 900,
    partyListCandidateCount: 150,
});
var partyK = new index_1.Party({
    id: '10',
    electedMemberCount: 34,
    voteCount: 870,
    partyListCandidateCount: 128,
});
var partyL = new index_1.Party({
    id: '11',
    electedMemberCount: 166,
    voteCount: 2750,
    partyListCandidateCount: 149,
});
var partyM = new index_1.Party({
    id: '12',
    electedMemberCount: 66,
    voteCount: 920,
    partyListCandidateCount: 101,
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
    it('should distribute seat to party having greatest remaining and candidate available', function () {
        var parties = index_1.calculatePartyList([partyH, partyI, partyJ, partyK, partyL, partyM]);
        assert.equal(parties.length, 6);
        assert.equal(parties[0].partyListMemberCount, 40);
        assert.equal(parties[1].partyListMemberCount, 34);
        assert.equal(parties[2].partyListMemberCount, 25);
        assert.equal(parties[3].partyListMemberCount, 26);
        assert.equal(parties[4].partyListMemberCount, 25);
        assert.equal(parties[5].partyListMemberCount, 0);
    });
});
