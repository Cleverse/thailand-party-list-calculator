/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2560
 */
import BigNumber from 'bignumber.js';
interface IParty {
    id: string;
    electedMemberCount: number;
    voteCount: number;
    partyListCandidateCount: number;
    partyListMemberCount?: number;
    isViableForPartyList(): Boolean;
}
export declare const PARTY_LIST_LIMIT = 150;
export declare const REP_LIMIT = 500;
export declare const calculatePartyList: (partiesInterface: IParty[]) => IParty[];
interface IPartyClassConstructorProps {
    id: string;
    electedMemberCount: number;
    voteCount: number;
    partyListCandidateCount: number;
}
export declare class Party implements IParty {
    id: string;
    electedMemberCount: number;
    voteCount: number;
    partyListCandidateCount: number;
    partyListMemberCount: number;
    private representativeCeiling;
    private remainder;
    constructor({ id, electedMemberCount, voteCount, partyListCandidateCount, }: IPartyClassConstructorProps);
    isViableForPartyList: () => Boolean;
    setRepCeiling: (ceiling: BigNumber) => void;
    getRepCeilingInt: () => BigNumber;
    getRepCeilingRemainder: () => BigNumber;
}
export {};
