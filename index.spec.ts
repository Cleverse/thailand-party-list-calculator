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
  it('should consider parties submitting limited party-list candidates', () => {
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
        partyListCandidateCount: 20,
      },
    ])
    assert.equal(parties.length, 2)
    assert.equal(parties[0].partyListMemberCount, 130)
    assert.equal(parties[1].partyListMemberCount, 20)
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
  it('should distribute remaining seats when some remainders are equal', () => {
    const parties = calculatePartyList([
      {
        id: '7',
        electedMemberCount: 140,
        voteCount: 43123151,
        partyListCandidateCount: 150,
      },
      {
        id: '8',
        electedMemberCount: 3,
        voteCount: 4713773,
        partyListCandidateCount: 21,
      },
      {
        id: '9',
        electedMemberCount: 200,
        voteCount: 38183888,
        partyListCandidateCount: 150,
      },
      {
        id: '10',
        electedMemberCount: 4,
        voteCount: 2530790,
        partyListCandidateCount: 150,
      },
      {
        id: '11',
        electedMemberCount: 2,
        voteCount: 2342339,
        partyListCandidateCount: 150,
      },
      {
        id: '12',
        electedMemberCount: 1,
        voteCount: 3323443,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 6)
    assert.equal(parties[0].partyListMemberCount, 89)
    assert.equal(parties[1].partyListMemberCount, 21)
    assert.equal(parties[2].partyListMemberCount, 3)
    assert.equal(parties[3].partyListMemberCount, 9)
    assert.equal(parties[4].partyListMemberCount, 11)
    assert.equal(parties[5].partyListMemberCount, 17)
  })
  it('should rebalance when party list members count exceeds limit then distribute', () => {
    const parties = calculatePartyList([
      {
        id: '7',
        electedMemberCount: 140,
        voteCount: 91231233,
        partyListCandidateCount: 150,
      },
      {
        id: '8',
        electedMemberCount: 3,
        voteCount: 4234234,
        partyListCandidateCount: 150,
      },
      {
        id: '9',
        electedMemberCount: 200,
        voteCount: 43423444,
        partyListCandidateCount: 150,
      },
      {
        id: '10',
        electedMemberCount: 4,
        voteCount: 2342342,
        partyListCandidateCount: 150,
      },
      {
        id: '11',
        electedMemberCount: 2,
        voteCount: 2342334,
        partyListCandidateCount: 150,
      },
      {
        id: '12',
        electedMemberCount: 1,
        voteCount: 3323443,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 6)
    assert.equal(parties[0].partyListMemberCount, 126)
    assert.equal(parties[1].partyListMemberCount, 9)
    assert.equal(parties[2].partyListMemberCount, 0)
    assert.equal(parties[3].partyListMemberCount, 3)
    assert.equal(parties[4].partyListMemberCount, 4)
    assert.equal(parties[5].partyListMemberCount, 8)
  })
  it('should rebalance when party list members count exceeds limit then distribute when some remainders are equal', () => {
    const parties = calculatePartyList([
      {
        id: '7',
        electedMemberCount: 140,
        voteCount: 91231233,
        partyListCandidateCount: 150,
      },
      {
        id: '8',
        electedMemberCount: 3,
        voteCount: 4234234,
        partyListCandidateCount: 150,
      },
      {
        id: '9',
        electedMemberCount: 200,
        voteCount: 43423444,
        partyListCandidateCount: 150,
      },
      {
        id: '10',
        electedMemberCount: 4,
        voteCount: 2342342,
        partyListCandidateCount: 150,
      },
      {
        id: '11',
        electedMemberCount: 4,
        voteCount: 2342334,
        partyListCandidateCount: 150,
      },
      {
        id: '12',
        electedMemberCount: 4,
        voteCount: 3746233,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 6)
    assert.equal(parties[0].partyListMemberCount, 128)
    assert.equal(parties[1].partyListMemberCount, 9)
    assert.equal(parties[2].partyListMemberCount, 0)
    assert.equal(parties[3].partyListMemberCount, 3)
    assert.equal(parties[4].partyListMemberCount, 3)
    assert.equal(parties[5].partyListMemberCount, 7)
  })
})
