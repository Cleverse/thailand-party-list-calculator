/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2561
 * https://www.ect.go.th/ect_th/download/article/article_20180913155522.pdf
 */

import BigNumber from 'bignumber.js'

interface IParty {
  id: string
  electedMemberCount: number
  voteCount: number
  partyListCandidateCount: number
  partyListMemberCount?: number
}

// § 128(4)
export const PARTY_LIST_LIMIT = 150

// § 128(1)
export const REP_LIMIT = 500

BigNumber.config({
  // § 128, ¶ 1
  DECIMAL_PLACES: 4,
  ROUNDING_MODE: BigNumber.ROUND_FLOOR,
})

export const calculatePartyList = (partiesInterface: IParty[]): IParty[] => {
  const originalIds = partiesInterface.map(p => p.id)

  // § 128(1)
  const allValidScores = getAllValidScores(partiesInterface)
  const score4Rep = calculateScore4Rep(allValidScores)

  let remainingPartyListSeat = PARTY_LIST_LIMIT
  let totalPartyListMember = 0

  // § 128(2)
  let parties = mapRepCeiling(partiesInterface, score4Rep)
  const extractOutput = (out: ICalculateOutput) => {
    parties = out.parties
    remainingPartyListSeat = out.remainingPartyListSeat
    totalPartyListMember = out.totalPartyListMember
  }

  // § 128(3–4)
  const output = calculatePartyListMemberCount({
    parties,
    remainingPartyListSeat,
    totalPartyListMember,
  })
  extractOutput(output)

  // § 128(7)
  if (totalPartyListMember > PARTY_LIST_LIMIT) {
    const output = rebalancePartyListMember({
      parties,
      remainingPartyListSeat,
      totalPartyListMember,
    })
    extractOutput(output)
  }
  // § 128(6)
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

// § 128(1)
const getAllValidScores = (parties: IParty[]) =>
  parties.reduce((result, party) => {
    return result + party.voteCount
  }, 0)

// § 128(1)
const calculateScore4Rep = (validScores: number): BigNumber =>
  new BigNumber(validScores).dividedBy(new BigNumber(REP_LIMIT))

// § 128(2)
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
    // § 128(3)
    const repCeilingDecimal = p.getRepCeilingDecimal()
    const expectRep = repCeilingDecimal.minus(p.electedMemberCount)
    // § 128(4)
    const partyListMemberCountDecimal = BigNumber.minimum(
      p.partyListCandidateCount,
      BigNumber.maximum(expectRep, 0)
    )
    const partyListMemberCount = partyListMemberCountDecimal
      .integerValue(BigNumber.ROUND_FLOOR)
      .toNumber()
    newRemainingPartyListSeat -= partyListMemberCount
    newTotalPartyListMember += partyListMemberCount
    p.partyListMemberCount = partyListMemberCount
    p.partyListMemberCountDecimal = partyListMemberCountDecimal
    return p
  })
  return {
    parties: result,
    remainingPartyListSeat: newRemainingPartyListSeat,
    totalPartyListMember: newTotalPartyListMember,
  }
}

// § 128(7)
const rebalancePartyListMember = ({
  parties,
  totalPartyListMember,
}: ICalculateInput): ICalculateOutput => {
  let newRemainingPartyListSeat = PARTY_LIST_LIMIT
  let newTotalPartyListMember = 0
  const result = parties.map(p => {
    const tempPartyListMemberCount = p.partyListMemberCountDecimal
    const newRepCeiling = tempPartyListMemberCount
      .multipliedBy(PARTY_LIST_LIMIT)
      .dividedBy(new BigNumber(totalPartyListMember))
    const partyListMemberCount = newRepCeiling
      .integerValue(BigNumber.ROUND_FLOOR)
      .toNumber()
    p.setRemainderForSorting(newRepCeiling.minus(partyListMemberCount))
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

// § 128(6)
const compareParty = (a: Party, b: Party) => {
  const aRemainder = a.getRemainderForSorting()
  const bRemainder = b.getRemainderForSorting()
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

// § 128(6)
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
  partyListMemberCountDecimal = new BigNumber(0)
  private representativeCeiling = new BigNumber(0)
  private remainderForSorting = new BigNumber(0)

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
    this.setRemainderForSorting(this.representativeCeiling.minus(intValue))
  }
  getRepCeilingInt = (): BigNumber =>
    this.representativeCeiling.integerValue(BigNumber.ROUND_FLOOR)
  getRepCeilingDecimal = (): BigNumber => this.representativeCeiling

  setRemainderForSorting = (remainder: BigNumber) => {
    this.remainderForSorting = remainder
  }
  getRemainderForSorting = (): BigNumber => this.remainderForSorting
}
