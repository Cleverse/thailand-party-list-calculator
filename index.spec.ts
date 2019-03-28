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
    assert.equal(parties[0].partyListMemberCount, 125)
    assert.equal(parties[1].partyListMemberCount, 9)
    assert.equal(parties[2].partyListMemberCount, 0)
    assert.equal(parties[3].partyListMemberCount, 3)
    assert.equal(parties[4].partyListMemberCount, 5)
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
  it('correctly calculate real election 2019 data', () => {
    const parties = calculatePartyList([
      {
        id: 'เพื่อไทย',
        electedMemberCount: 137,
        voteCount: 7920630,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังประชารัฐ',
        electedMemberCount: 97,
        voteCount: 8433137,
        partyListCandidateCount: 150,
      },
      {
        id: 'อนาคตใหม่',
        electedMemberCount: 30,
        voteCount: 6265950,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาธิปัตย์',
        electedMemberCount: 33,
        voteCount: 3947726,
        partyListCandidateCount: 150,
      },
      {
        id: 'ภูมิใจไทย',
        electedMemberCount: 39,
        voteCount: 3732883,
        partyListCandidateCount: 150,
      },
      {
        id: 'เสรีรวมไทย',
        electedMemberCount: 0,
        voteCount: 826530,
        partyListCandidateCount: 150,
      },
      {
        id: 'ชาติไทยพัฒนา',
        electedMemberCount: 6,
        voteCount: 782031,
        partyListCandidateCount: 150,
      },
      {
        id: 'เศรษฐกิจใหม่',
        electedMemberCount: 0,
        voteCount: 485664,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาชาติ',
        electedMemberCount: 6,
        voteCount: 485436,
        partyListCandidateCount: 150,
      },
      {
        id: 'เพื่อชาติ',
        electedMemberCount: 0,
        voteCount: 419393,
        partyListCandidateCount: 150,
      },
      {
        id: 'รวมพลังประชาชาติไทย',
        electedMemberCount: 1,
        voteCount: 416324,
        partyListCandidateCount: 150,
      },
      {
        id: 'ชาติพัฒนา',
        electedMemberCount: 1,
        voteCount: 252044,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังท้องถิ่นไท',
        electedMemberCount: 0,
        voteCount: 213129,
        partyListCandidateCount: 150,
      },
      {
        id: 'รักษ์ผืนป่าประเทศไทย',
        electedMemberCount: 0,
        voteCount: 136597,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังปวงชนไทย',
        electedMemberCount: 0,
        voteCount: 81733,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังชาติไทย',
        electedMemberCount: 0,
        voteCount: 73871,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาภิวัฒน์',
        electedMemberCount: 0,
        voteCount: 69417,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังไทยรักไทย',
        electedMemberCount: 0,
        voteCount: 60840,
        partyListCandidateCount: 150,
      },
      {
        id: 'ไทยศรีวิไลย์',
        electedMemberCount: 0,
        voteCount: 60421,
        partyListCandidateCount: 150,
      },
      {
        id: 'ครูไทยเพื่อประชาชน',
        electedMemberCount: 0,
        voteCount: 56339,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชานิยม',
        electedMemberCount: 0,
        voteCount: 56617,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาธรรมไทย',
        electedMemberCount: 0,
        voteCount: 47848,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาชนปฏิรูป',
        electedMemberCount: 0,
        voteCount: 45508,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลเมืองไทย',
        electedMemberCount: 0,
        voteCount: 44766,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาธิปไตยใหม่',
        electedMemberCount: 0,
        voteCount: 39792,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังธรรมใหม่',
        electedMemberCount: 0,
        voteCount: 35533,
        partyListCandidateCount: 150,
      },
      {
        id: 'ไทรักธรรม',
        electedMemberCount: 0,
        voteCount: 33748,
        partyListCandidateCount: 150,
      },
      {
        id: 'เพื่อแผ่นดิน',
        electedMemberCount: 0,
        voteCount: 31307,
        partyListCandidateCount: 150,
      },
      {
        id: 'ทางเลือกใหม่',
        electedMemberCount: 0,
        voteCount: 29607,
        partyListCandidateCount: 150,
      },
      {
        id: 'ภราดรภาพ',
        electedMemberCount: 0,
        voteCount: 27799,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังประชาธิปไตย',
        electedMemberCount: 0,
        voteCount: 26617,
        partyListCandidateCount: 150,
      },
      {
        id: 'เพื่อคนไทย',
        electedMemberCount: 0,
        voteCount: 26598,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังไทสร้างชาติ',
        electedMemberCount: 0,
        voteCount: 23059,
        partyListCandidateCount: 150,
      },
      {
        id: 'กรีน',
        electedMemberCount: 0,
        voteCount: 22662,
        partyListCandidateCount: 150,
      },
      {
        id: 'แผ่นดินธรรม',
        electedMemberCount: 0,
        voteCount: 21463,
        partyListCandidateCount: 150,
      },
      {
        id: 'มหาชน',
        electedMemberCount: 0,
        voteCount: 17867,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังสังคม',
        electedMemberCount: 0,
        voteCount: 17683,
        partyListCandidateCount: 150,
      },
      {
        id: 'สยามพัฒนา',
        electedMemberCount: 0,
        voteCount: 16839,
        partyListCandidateCount: 150,
      },
      {
        id: 'เครือข่ายชาวนาแห่งประเทศไทย',
        electedMemberCount: 0,
        voteCount: 17664,
        partyListCandidateCount: 150,
      },
      {
        id: 'แทนคุณแผ่นดิน',
        electedMemberCount: 0,
        voteCount: 17112,
        partyListCandidateCount: 150,
      },
      {
        id: 'เพื่อธรรม',
        electedMemberCount: 0,
        voteCount: 15365,
        partyListCandidateCount: 150,
      },
      {
        id: 'รวมใจไทย',
        electedMemberCount: 0,
        voteCount: 13457,
        partyListCandidateCount: 150,
      },
      {
        id: 'คลองไทย',
        electedMemberCount: 0,
        voteCount: 12946,
        partyListCandidateCount: 150,
      },
      {
        id: 'ผึ้งหลวง',
        electedMemberCount: 0,
        voteCount: 12576,
        partyListCandidateCount: 150,
      },
      {
        id: 'ภาคีเครือข่ายไทย',
        electedMemberCount: 0,
        voteCount: 12268,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชากรไทย',
        electedMemberCount: 0,
        voteCount: 11839,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาไทย',
        electedMemberCount: 0,
        voteCount: 11043,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังไทยรักชาติ',
        electedMemberCount: 0,
        voteCount: 9685,
        partyListCandidateCount: 150,
      },
      {
        id: 'ชาติพันธุ์ไทย',
        electedMemberCount: 0,
        voteCount: 9757,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังศรัทธา',
        electedMemberCount: 0,
        voteCount: 9561,
        partyListCandidateCount: 150,
      },
      {
        id: 'ความหวังใหม่',
        electedMemberCount: 0,
        voteCount: 9074,
        partyListCandidateCount: 150,
      },
      {
        id: 'เพื่อไทยพัฒนา',
        electedMemberCount: 0,
        voteCount: 8095,
        partyListCandidateCount: 150,
      },
      {
        id: 'ถิ่นกาขาวชาววิไล',
        electedMemberCount: 0,
        voteCount: 6799,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังครูไทย',
        electedMemberCount: 0,
        voteCount: 6398,
        partyListCandidateCount: 150,
      },
      {
        id: 'ไทยธรรม',
        electedMemberCount: 0,
        voteCount: 5942,
        partyListCandidateCount: 150,
      },
      {
        id: 'สังคมประชาธิปไตยไทย',
        electedMemberCount: 0,
        voteCount: 5334,
        partyListCandidateCount: 150,
      },
      {
        id: 'กลาง',
        electedMemberCount: 0,
        voteCount: 5447,
        partyListCandidateCount: 150,
      },
      {
        id: 'สามัญชน',
        electedMemberCount: 0,
        voteCount: 5321,
        partyListCandidateCount: 150,
      },
      {
        id: 'ฐานรากไทย',
        electedMemberCount: 0,
        voteCount: 4786,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังรัก',
        electedMemberCount: 0,
        voteCount: 4624,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังแผ่นดินทอง',
        electedMemberCount: 0,
        voteCount: 4568,
        partyListCandidateCount: 150,
      },
      {
        id: 'ไทยรุ่งเรือง',
        electedMemberCount: 0,
        voteCount: 4237,
        partyListCandidateCount: 150,
      },
      {
        id: 'ภูมิพลังเกษตรกรไทย',
        electedMemberCount: 0,
        voteCount: 3535,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังแรงงานไทย',
        electedMemberCount: 0,
        voteCount: 2951,
        partyListCandidateCount: 150,
      },
      {
        id: 'คนธรรมดาแห่งประเทศไทย',
        electedMemberCount: 0,
        voteCount: 2353,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังไทยดี',
        electedMemberCount: 0,
        voteCount: 2536,
        partyListCandidateCount: 150,
      },
      {
        id: 'พลังสหกรณ์',
        electedMemberCount: 0,
        voteCount: 2343,
        partyListCandidateCount: 150,
      },
      {
        id: 'เพื่อชีวิตใหม่',
        electedMemberCount: 0,
        voteCount: 1595,
        partyListCandidateCount: 150,
      },
      {
        id: 'พัฒนาประเทศไทย',
        electedMemberCount: 0,
        voteCount: 1079,
        partyListCandidateCount: 150,
      },
      {
        id: 'เพื่อสหกรณ์ไทย',
        electedMemberCount: 0,
        voteCount: 905,
        partyListCandidateCount: 150,
      },
      {
        id: 'มติประชา',
        electedMemberCount: 0,
        voteCount: 791,
        partyListCandidateCount: 150,
      },
      {
        id: 'ยางพาราไทย',
        electedMemberCount: 0,
        voteCount: 610,
        partyListCandidateCount: 150,
      },
      {
        id: 'ประชาธิปไตยเพื่อประชาชน',
        electedMemberCount: 0,
        voteCount: 562,
        partyListCandidateCount: 150,
      },
      {
        id: 'กสิกรไทย',
        electedMemberCount: 0,
        voteCount: 183,
        partyListCandidateCount: 150,
      },
      {
        id: 'รักท้องถิ่นไทย',
        electedMemberCount: 0,
        voteCount: 3254,
        partyListCandidateCount: 150,
      },
      {
        id: 'รักษ์ธรรม',
        electedMemberCount: 0,
        voteCount: 446,
        partyListCandidateCount: 150,
      },
      {
        id: 'อนาคตไทย',
        electedMemberCount: 0,
        voteCount: 198,
        partyListCandidateCount: 150,
      },
    ])
    assert.equal(parties.length, 77)
    assert.deepEqual(parties.map(p => p.partyListMemberCount), [
      0,
      21,
      57,
      22,
      13,
      11,
      4,
      6,
      0,
      5,
      4,
      2,
      2,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ])
  })
})
