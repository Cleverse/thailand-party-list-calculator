/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2561
 */

import * as _ from 'lodash'
import BigNumber from 'bignumber.js'

interface IParty {
  id: string
  electedMemberCount: number
  voteCount: number
  partyListCandidateCount: number
  partyListMemberCount?: number
  isViableForPartyList(): Boolean
}

export const PARTY_LIST_LIMIT = 150
export const REP_LIMIT = 500
export const calculatePartyList = (parties: IParty[]): IParty[] => {
  const ids = _.map(parties, p => p.id)
  const allValidScores = _.reduce(
    parties,
    (result, party) => {
      return result + party.voteCount
    },
    0
  )
  const partiesForCalc = _.map(
    parties,
    p =>
      new Party({
        id: p.id,
        electedMemberCount: p.electedMemberCount,
        voteCount: p.voteCount,
        partyListCandidateCount: p.partyListCandidateCount,
      })
  )

  const bAllValidScores = new BigNumber(allValidScores)
  const bREP_LIMIT = new BigNumber(REP_LIMIT)
  const score4Rep = bAllValidScores.dividedBy(bREP_LIMIT)

  let remainingPartyListSeat = PARTY_LIST_LIMIT
  let totalPartyListMember = 0

  BigNumber.config({
    DECIMAL_PLACES: 4,
  })
  let pParties = _.map(partiesForCalc, p => {
    const vote = new BigNumber(p.voteCount)
    const repCeiling = vote.dividedBy(score4Rep)
    p.setRepCeiling(repCeiling)
    return p
  })

  pParties = _.map(pParties, p => {
    const repCeiling = p.getRepCeilingInt()
    const expectRep = repCeiling.toNumber() - p.electedMemberCount
    const partyListMemberCount = Math.min(
      p.partyListCandidateCount,
      Math.max(expectRep, 0)
    )
    remainingPartyListSeat -= partyListMemberCount
    totalPartyListMember += partyListMemberCount
    p.partyListMemberCount = partyListMemberCount
    return p
  })

  if (totalPartyListMember > PARTY_LIST_LIMIT) {
    let newRemainingPartyListSeat = PARTY_LIST_LIMIT
    let newTotalPartyListMember = 0
    pParties = _.map(pParties, p => {
      const tempPartyListMemberCount = new BigNumber(
        p.partyListMemberCount as number
      )
      const partyListMemberCount = tempPartyListMemberCount
        .multipliedBy(REP_LIMIT)
        .dividedBy(new BigNumber(totalPartyListMember))
        .integerValue(BigNumber.ROUND_FLOOR)
        .toNumber()
      newRemainingPartyListSeat -= partyListMemberCount
      newTotalPartyListMember += partyListMemberCount
      p.partyListMemberCount = partyListMemberCount
      return p
    })
    remainingPartyListSeat = newRemainingPartyListSeat
    totalPartyListMember = newTotalPartyListMember
  }
  if (remainingPartyListSeat > 0) {
    pParties.sort((a, b) => {
      const aRemainder = a.getRepCeilingRemainder()
      const bRemainder = b.getRepCeilingRemainder()
      const aRepCeiling = a.getRepCeilingInt().toNumber()
      const bRepCeiling = b.getRepCeilingInt().toNumber()
      const aTempValue = a.voteCount / aRepCeiling
      const bTempValue = b.voteCount / bRepCeiling
      return aRemainder.isGreaterThan(bRemainder)
        ? -1
        : aRemainder.isLessThan(bRemainder)
        ? 1
        : aTempValue > bTempValue
        ? -1
        : 1
    })
    let index = 0
    let viableParties = pParties
    while (remainingPartyListSeat > 0) {
      viableParties = viableParties.filter(
        p =>
          p.isViableForPartyList() &&
          p.partyListCandidateCount > p.partyListMemberCount
      )
      const viablePartiesIndex = index % viableParties.length
      const viableParty = viableParties[viablePartiesIndex]
      viableParty.partyListMemberCount += 1
      index += 1
      totalPartyListMember += 1
      remainingPartyListSeat -= 1
    }
  }
  pParties = _.map(ids, id => _.find(pParties, p => p.id === id) as Party)

  return pParties
}

interface IPartyClassConstructorProps {
  id: string
  electedMemberCount: number
  voteCount: number
  partyListCandidateCount: number
}

export class Party implements IParty {
  id: string
  electedMemberCount: number
  voteCount: number
  partyListCandidateCount: number
  partyListMemberCount: number = 0

  private representativeCeiling = new BigNumber(0)
  private remainder = new BigNumber(0)

  constructor({
    id,
    electedMemberCount,
    voteCount,
    partyListCandidateCount,
  }: IPartyClassConstructorProps) {
    this.id = id
    this.electedMemberCount = electedMemberCount
    this.voteCount = voteCount
    this.partyListCandidateCount = partyListCandidateCount
    this.partyListMemberCount = 0
  }

  isViableForPartyList = (): Boolean => {
    const repCeilingIntValue = this.getRepCeilingInt().toNumber()
    return repCeilingIntValue > this.electedMemberCount
  }

  setRepCeiling = (ceiling: BigNumber) => {
    this.representativeCeiling = ceiling
    const intValue = this.getRepCeilingInt()
    this.remainder = this.representativeCeiling.minus(intValue)
  }
  getRepCeilingInt = (): BigNumber =>
    this.representativeCeiling.integerValue(BigNumber.ROUND_FLOOR)
  getRepCeilingRemainder = (): BigNumber => this.remainder
}
