import { Party, calculatePartyList } from "./index";
import * as assert from "assert";

const partyA = new Party({
  id: "1",
  electedMemberCount: 350,
  voteCount: 1000,
  partyListCandidateCount: 150
});
const partyB = new Party({
  id: "2",
  electedMemberCount: 175,
  voteCount: 1000,
  partyListCandidateCount: 150
});
const partyC = new Party({
  id: "3",
  electedMemberCount: 175,
  voteCount: 1000,
  partyListCandidateCount: 0
});
const partyD = new Party({
  id: "4",
  electedMemberCount: 0,
  voteCount: 1,
  partyListCandidateCount: 150
});
const partyE = new Party({
  id: "4",
  electedMemberCount: 251,
  voteCount: 1000,
  partyListCandidateCount: 150
});
const partyF = new Party({
  id: "5",
  electedMemberCount: 99,
  voteCount: 1000,
  partyListCandidateCount: 150
});
describe("Thailand Election Party List Calculation", () => {
  it("should pass monopoly case", () => {
    const parties = calculatePartyList({
      parties: [partyA],
      voterCount: 1000,
      voteNoCount: 0,
      invalidCount: 0
    });
    assert.equal(parties.length, 1);
    assert.equal(parties[0].partyListMember, 150);
  });
  it("should split equally between 2 parties", () => {
    const parties = calculatePartyList({
      parties: [partyB, partyB],
      voterCount: 2000,
      voteNoCount: 0,
      invalidCount: 0
    });
    assert.equal(parties.length, 2);
    assert.equal(parties[0].partyListMember, 75);
    assert.equal(parties[1].partyListMember, 75);
  });
  it("should exclude parties not submitting candidate", () => {
    const parties = calculatePartyList({
      parties: [partyB, partyC],
      voterCount: 2000,
      voteNoCount: 0,
      invalidCount: 0
    });
    assert.equal(parties.length, 2);
    assert.equal(parties[0].partyListMember, 150);
    assert.equal(parties[1].partyListMember, 0);
  });
  it("should exclude parties not reaching minimum votes", () => {
    const parties = calculatePartyList({
      parties: [partyB, partyD],
      voterCount: 1001,
      voteNoCount: 0,
      invalidCount: 0
    });
    assert.equal(parties.length, 2);
    assert.equal(parties[0].partyListMember, 150);
    assert.equal(parties[1].partyListMember, 0);
  });
  it("should exclude vote no and invalid ballot", () => {
    const parties = calculatePartyList({
      parties: [partyB, partyB],
      voterCount: 2008,
      voteNoCount: 5,
      invalidCount: 3
    });
    assert.equal(parties.length, 2);
    assert.equal(parties[0].partyListMember, 75);
    assert.equal(parties[1].partyListMember, 75);
  });
  it("should exclude party with exceeded elected members", () => {
    const parties = calculatePartyList({
      parties: [partyE, partyF],
      voterCount: 2000,
      voteNoCount: 0,
      invalidCount: 0
    });
    assert.equal(parties.length, 2);
    assert.equal(parties[0].partyListMember, 0);
    assert.equal(parties[1].partyListMember, 150);
  });
  it("should throw error if total votes does not make sense (exceed)", () => {
    assert.throws(() => {
      calculatePartyList({
        parties: [partyB, partyB],
        voterCount: 1999,
        voteNoCount: 0,
        invalidCount: 0
      });
    });
  });
  it("should throw error if total votes does not make sense (lacking)", () => {
    assert.throws(() => {
      calculatePartyList({
        parties: [partyB, partyB],
        voterCount: 2001,
        voteNoCount: 0,
        invalidCount: 0
      });
    });
  });
});
