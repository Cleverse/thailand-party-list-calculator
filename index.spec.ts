import { calculatePartyList } from './index'
import * as assert from 'assert'

describe('Thailand Election Party List Calculation', () => {
  it('should pass monopoly case', () => {
    const parties = calculatePartyList([
      {
        id: '1',
        electedMemberCount: 350,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 1)
    assert.equal(parties[0].partyListMemberCount, 150)
  })
  it('should split equally between 2 parties', () => {
    const parties = calculatePartyList([
      {
        id: '2',
        electedMemberCount: 175,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
      {
        id: '6',
        electedMemberCount: 175,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 75)
    assert.equal(parties[1].partyListMemberCount, 75)
  })
  it('should exclude parties not submitting candidate', () => {
    const parties = calculatePartyList([
      {
        id: '2',
        electedMemberCount: 175,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
      {
        id: '3',
        electedMemberCount: 175,
        voteCount: 1000,
        partyListCandidateCount: 0,
      },
    ])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 150)
    assert.equal(parties[1].partyListMemberCount, 0)
  })
  it('should exclude parties not reaching minimum votes', () => {
    const parties = calculatePartyList([
      {
        id: '2',
        electedMemberCount: 175,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
      {
        id: '4',
        electedMemberCount: 0,
        voteCount: 1,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 150)
    assert.equal(parties[1].partyListMemberCount, 0)
  })
  it('should exclude vote no and invalid ballot', () => {
    const parties = calculatePartyList([
      {
        id: '2',
        electedMemberCount: 175,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
      {
        id: '6',
        electedMemberCount: 175,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 75)
    assert.equal(parties[1].partyListMemberCount, 75)
  })
  it('should exclude party with exceeded elected members', () => {
    const parties = calculatePartyList([
      {
        id: '4',
        electedMemberCount: 251,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
      {
        id: '5',
        electedMemberCount: 99,
        voteCount: 1000,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 0)
    assert.equal(parties[1].partyListMemberCount, 150)
  })
  it('should distribute seat to party having greatest remaining and candidate available', () => {
    const parties = calculatePartyList([
      {
        id: '7',
        electedMemberCount: 31,
        voteCount: 1040,
        partyListCandidateCount: 40,
      },
      {
        id: '8',
        electedMemberCount: 15,
        voteCount: 700,
        partyListCandidateCount: 34,
      },
      {
        id: '9',
        electedMemberCount: 38,
        voteCount: 900,
        partyListCandidateCount: 150,
      },
      {
        id: '10',
        electedMemberCount: 34,
        voteCount: 870,
        partyListCandidateCount: 128,
      },
      {
        id: '11',
        electedMemberCount: 166,
        voteCount: 2750,
        partyListCandidateCount: 149,
      },
      {
        id: '12',
        electedMemberCount: 66,
        voteCount: 920,
        partyListCandidateCount: 101,
      },
    ])
    assert.equal(parties.length, 6)
    assert.equal(parties[0].partyListMemberCount, 40)
    assert.equal(parties[1].partyListMemberCount, 34)
    assert.equal(parties[2].partyListMemberCount, 25)
    assert.equal(parties[3].partyListMemberCount, 26)
    assert.equal(parties[4].partyListMemberCount, 25)
    assert.equal(parties[5].partyListMemberCount, 0)
  })
})
