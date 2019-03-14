/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2561
 */

import * as _ from "lodash";

interface IParty {
  id: string;
  electedMemberCount: number;
  voteCount: number;
  partyListCandidateCount: number;
  partyListMemberCount?: number;
  isViableForPartyList(): Boolean;
}

interface ICalculatePartyListInput {
  parties: IParty[];
  voterCount: number;
  voteNoCount: number;
  invalidCount: number;
}

export const calculatePartyList = ({
  parties,
  voterCount,
  voteNoCount,
  invalidCount
}: ICalculatePartyListInput): Party[] => {
  const maxPossibleVotes = voterCount - voteNoCount - invalidCount;
  const score4Rep = maxPossibleVotes / REP_LIMIT;
  const allValidScores = _.reduce(
    parties,
    (result, party) => {
      return result + party.voteCount;
    },
    0
  );
  const dummyParty = {
    id: "DUMMY",
    electedMemberCount: 0,
    voteCount: maxPossibleVotes - allValidScores,
    partyListCandidateCount: PARTY_LIST_LIMIT
  };
  return _.map(parties, p => ({ ...p, partyListMember: 0 }));
};

export const PARTY_LIST_LIMIT = 150;
export const REP_LIMIT = 500;

interface IPartyClassConstructorProps {
  id: string;
  electedMemberCount: number;
  voteCount: number;
  partyListCandidateCount: number;
}

export class Party implements IParty {
  id: string;
  electedMemberCount: number;
  voteCount: number;
  partyListCandidateCount: number;
  partyListMember?: number;
  constructor({
    id,
    electedMemberCount,
    voteCount,
    partyListCandidateCount
  }: IPartyClassConstructorProps) {
    this.id = id;
    this.electedMemberCount = electedMemberCount;
    this.voteCount = voteCount;
    this.partyListCandidateCount = partyListCandidateCount;
  }

  isViableForPartyList = () => {
    return true;
  };
}
