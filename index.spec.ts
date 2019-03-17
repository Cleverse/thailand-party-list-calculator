import { Party, calculatePartyList } from './index'
import * as assert from 'assert'

const partyA = new Party({
  id: '1',
  electedMemberCount: 350,
  voteCount: 1000,
  partyListCandidateCount: 150,
})
const partyB = new Party({
  id: '2',
  electedMemberCount: 175,
  voteCount: 1000,
  partyListCandidateCount: 150,
})
const partyC = new Party({
  id: '3',
  electedMemberCount: 175,
  voteCount: 1000,
  partyListCandidateCount: 0,
})
const partyD = new Party({
  id: '4',
  electedMemberCount: 0,
  voteCount: 1,
  partyListCandidateCount: 150,
})
const partyE = new Party({
  id: '4',
  electedMemberCount: 251,
  voteCount: 1000,
  partyListCandidateCount: 150,
})
const partyF = new Party({
  id: '5',
  electedMemberCount: 99,
  voteCount: 1000,
  partyListCandidateCount: 150,
})
const partyG = new Party({
  id: '6',
  electedMemberCount: 175,
  voteCount: 1000,
  partyListCandidateCount: 150,
})
const partyH = new Party({
  id: '7',
  electedMemberCount: 31,
  voteCount: 1040,
  partyListCandidateCount: 40,
})
const partyI = new Party({
  id: '8',
  electedMemberCount: 15,
  voteCount: 700,
  partyListCandidateCount: 34,
})
const partyJ = new Party({
  id: '9',
  electedMemberCount: 38,
  voteCount: 900,
  partyListCandidateCount: 150,
})
const partyK = new Party({
  id: '10',
  electedMemberCount: 34,
  voteCount: 870,
  partyListCandidateCount: 128,
})
const partyL = new Party({
  id: '11',
  electedMemberCount: 166,
  voteCount: 2750,
  partyListCandidateCount: 149,
})
const partyM = new Party({
  id: '12',
  electedMemberCount: 66,
  voteCount: 920,
  partyListCandidateCount: 101,
})

describe('Thailand Election Party List Calculation', () => {
  it('should pass monopoly case', () => {
    const parties = calculatePartyList([partyA])
    assert.equal(parties.length, 1)
    assert.equal(parties[0].partyListMemberCount, 150)
  })
  it('should split equally between 2 parties', () => {
    const parties = calculatePartyList([partyB, partyG])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 75)
    assert.equal(parties[1].partyListMemberCount, 75)
  })
  it('should exclude parties not submitting candidate', () => {
    const parties = calculatePartyList([partyB, partyC])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 150)
    assert.equal(parties[1].partyListMemberCount, 0)
  })
  it('should exclude parties not reaching minimum votes', () => {
    const parties = calculatePartyList([partyB, partyD])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 150)
    assert.equal(parties[1].partyListMemberCount, 0)
  })
  it('should exclude vote no and invalid ballot', () => {
    const parties = calculatePartyList([partyB, partyG])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 75)
    assert.equal(parties[1].partyListMemberCount, 75)
  })
  it('should exclude party with exceeded elected members', () => {
    const parties = calculatePartyList([partyE, partyF])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 0)
    assert.equal(parties[1].partyListMemberCount, 150)
  })
  it('should distribute seat to party having greatest remaining and candidate available', () => {
    const parties = calculatePartyList([partyH, partyI, partyJ, partyK, partyL, partyM])
    assert.equal(parties.length, 6)
    assert.equal(parties[0].partyListMemberCount, 40)
    assert.equal(parties[1].partyListMemberCount, 34)
    assert.equal(parties[2].partyListMemberCount, 25)
    assert.equal(parties[3].partyListMemberCount, 26)
    assert.equal(parties[4].partyListMemberCount, 25)
    assert.equal(parties[5].partyListMemberCount, 0)
  })
})
