/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2560
 */

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

BigNumber.config({
  DECIMAL_PLACES: 4,
})

export const calculatePartyList = (partiesInterface: IParty[]): IParty[] => {
  const originalIds = partiesInterface.map(p => p.id)
  const allValidScores = getAllValidScores(partiesInterface)
  const score4Rep = calculateScore4Rep(allValidScores)

  let remainingPartyListSeat = PARTY_LIST_LIMIT
  let totalPartyListMember = 0
  let parties = mapRepCeiling(partiesInterface, score4Rep)
  const extractOutput = (out: ICalculateOutput) => {
    parties = out.parties
    remainingPartyListSeat = out.remainingPartyListSeat
    totalPartyListMember = out.totalPartyListMember
  }

  const output = calculatePartyListMemberCount({
    parties,
    remainingPartyListSeat,
    totalPartyListMember,
  })
  extractOutput(output)

  if (totalPartyListMember > PARTY_LIST_LIMIT) {
    const output = rebalancePartyListMember({
      parties,
      remainingPartyListSeat,
      totalPartyListMember,
    })
    extractOutput(output)
  }
  if (remainingPartyListSeat > 0) {
    const output = distributeRemainingSeats(
      {
        parties,
        remainingPartyListSeat,
        totalPartyListMember,
      },
      originalIds
    )
    extractOutput(output)
  }

  return parties
}

interface ICalculateInput {
  parties: Party[]
  remainingPartyListSeat: number
  totalPartyListMember: number
}
interface ICalculateOutput {
  parties: Party[]
  remainingPartyListSeat: number
  totalPartyListMember: number
}

const getAllValidScores = (parties: IParty[]) =>
  parties.reduce((result, party) => {
    return result + party.voteCount
  }, 0)

const calculateScore4Rep = (validScores: number): BigNumber =>
  new BigNumber(validScores).dividedBy(new BigNumber(REP_LIMIT))

const mapRepCeiling = (parties: IParty[], score4Rep: BigNumber): Party[] =>
  parties.map(party => {
    const p = new Party({
      id: party.id,
      electedMemberCount: party.electedMemberCount,
      voteCount: party.voteCount,
      partyListCandidateCount: party.partyListCandidateCount,
    })
    const vote = new BigNumber(p.voteCount)
    const repCeiling = vote.dividedBy(score4Rep)
    p.setRepCeiling(repCeiling)
    return p
  })

const calculatePartyListMemberCount = ({
  parties,
  remainingPartyListSeat,
  totalPartyListMember,
}: ICalculateInput): ICalculateOutput => {
  let newRemainingPartyListSeat = remainingPartyListSeat
  let newTotalPartyListMember = totalPartyListMember
  const result = parties.map(p => {
    const repCeiling = p.getRepCeilingInt()
    const expectRep = repCeiling.toNumber() - p.electedMemberCount
    const partyListMemberCount = Math.min(
      p.partyListCandidateCount,
      Math.max(expectRep, 0)
    )
    newRemainingPartyListSeat -= partyListMemberCount
    newTotalPartyListMember += partyListMemberCount
    p.partyListMemberCount = partyListMemberCount
    return p
  })
  return {
    parties: result,
    remainingPartyListSeat: newRemainingPartyListSeat,
    totalPartyListMember: newTotalPartyListMember,
  }
}

const rebalancePartyListMember = ({
  parties,
  totalPartyListMember,
}: ICalculateInput): ICalculateOutput => {
  let newRemainingPartyListSeat = PARTY_LIST_LIMIT
  let newTotalPartyListMember = 0
  const result = parties.map(p => {
    const tempPartyListMemberCount = new BigNumber(
      p.partyListMemberCount as number
    )
    const partyListMemberCount = tempPartyListMemberCount
      .multipliedBy(PARTY_LIST_LIMIT)
      .dividedBy(new BigNumber(totalPartyListMember))
      .integerValue(BigNumber.ROUND_FLOOR)
      .toNumber()
    newRemainingPartyListSeat -= partyListMemberCount
    newTotalPartyListMember += partyListMemberCount
    p.partyListMemberCount = partyListMemberCount
    return p
  })
  return {
    parties: result,
    remainingPartyListSeat: newRemainingPartyListSeat,
    totalPartyListMember: newTotalPartyListMember,
  }
}

const compareParty = (a: Party, b: Party) => {
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
}

const distributeRemainingSeats = (
  { parties, remainingPartyListSeat, totalPartyListMember }: ICalculateInput,
  originalIds: string[]
): ICalculateOutput => {
  let newRemainingPartyListSeat = remainingPartyListSeat
  let newTotalPartyListMember = totalPartyListMember
  const clonedParties = parties
  clonedParties.sort(compareParty)
  let index = 0
  let viableParties = clonedParties
  while (newRemainingPartyListSeat > 0 && viableParties.length > 0) {
    if (index === 0) {
      viableParties = viableParties.filter(
        p =>
          p.isViableForPartyList() &&
          p.partyListCandidateCount > p.partyListMemberCount
      )
    }
    const viablePartiesIndex = index % viableParties.length
    const viableParty = viableParties[viablePartiesIndex]
    viableParty.partyListMemberCount += 1
    index += 1
    newRemainingPartyListSeat -= 1
    newTotalPartyListMember += 1
    if (index === viableParties.length) index = 0
  }
  const sortedParties = originalIds.map(
    id => clonedParties.filter(party => party.id === id)[0]
  )
  return {
    parties: sortedParties,
    remainingPartyListSeat: newRemainingPartyListSeat,
    totalPartyListMember: newTotalPartyListMember,
  }
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
