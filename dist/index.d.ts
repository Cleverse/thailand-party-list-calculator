/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2561
 * https://www.ect.go.th/ect_th/download/article/article_20180913155522.pdf
 */
import BigNumber from 'bignumber.js';
interface IParty {
    id: string;
    electedMemberCount: number;
    voteCount: number;
    partyListCandidateCount: number;
    partyListMemberCount?: number;
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
    partyListMemberCountDecimal: BigNumber;
    private representativeCeiling;
    private remainderForSorting;
    constructor({ id, electedMemberCount, voteCount, partyListCandidateCount, }: IPartyClassConstructorProps);
    isViableForPartyList: () => Boolean;
    setRepCeiling: (ceiling: BigNumber) => void;
    getRepCeilingInt: () => BigNumber;
    getRepCeilingDecimal: () => BigNumber;
    setRemainderForSorting: (remainder: BigNumber) => void;
    getRemainderForSorting: () => BigNumber;
}
export {};
