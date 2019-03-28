"use strict";
/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2561
 * https://www.ect.go.th/ect_th/download/article/article_20180913155522.pdf
 */
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
// § 128(4)
exports.PARTY_LIST_LIMIT = 150;
// § 128(1)
exports.REP_LIMIT = 500;
bignumber_js_1.default.config({
    // § 128, ¶ 1
    DECIMAL_PLACES: 4,
    ROUNDING_MODE: bignumber_js_1.default.ROUND_FLOOR,
});
exports.calculatePartyList = function (partiesInterface) {
    var originalIds = partiesInterface.map(function (p) { return p.id; });
    // § 128(1)
    var allValidScores = getAllValidScores(partiesInterface);
    var score4Rep = calculateScore4Rep(allValidScores);
    var remainingPartyListSeat = exports.PARTY_LIST_LIMIT;
    var totalPartyListMember = 0;
    // § 128(2)
    var parties = mapRepCeiling(partiesInterface, score4Rep);
    var extractOutput = function (out) {
        parties = out.parties;
        remainingPartyListSeat = out.remainingPartyListSeat;
        totalPartyListMember = out.totalPartyListMember;
    };
    // § 128(3–4)
    var output = calculatePartyListMemberCount({
        parties: parties,
        remainingPartyListSeat: remainingPartyListSeat,
        totalPartyListMember: totalPartyListMember,
    });
    extractOutput(output);
    // § 128(7)
    if (totalPartyListMember > exports.PARTY_LIST_LIMIT) {
        var output_1 = rebalancePartyListMember({
            parties: parties,
            remainingPartyListSeat: remainingPartyListSeat,
            totalPartyListMember: totalPartyListMember,
        });
        extractOutput(output_1);
    }
    // § 128(6)
    if (remainingPartyListSeat > 0) {
        var output_2 = distributeRemainingSeats({
            parties: parties,
            remainingPartyListSeat: remainingPartyListSeat,
            totalPartyListMember: totalPartyListMember,
        }, originalIds);
        extractOutput(output_2);
    }
    return parties;
};
// § 128(1)
var getAllValidScores = function (parties) {
    return parties.reduce(function (result, party) {
        return result + party.voteCount;
    }, 0);
};
// § 128(1)
var calculateScore4Rep = function (validScores) {
    return new bignumber_js_1.default(validScores).dividedBy(new bignumber_js_1.default(exports.REP_LIMIT));
};
// § 128(2)
var mapRepCeiling = function (parties, score4Rep) {
    return parties.map(function (party) {
        var p = new Party({
            id: party.id,
            electedMemberCount: party.electedMemberCount,
            voteCount: party.voteCount,
            partyListCandidateCount: party.partyListCandidateCount,
        });
        var vote = new bignumber_js_1.default(p.voteCount);
        var repCeiling = vote.dividedBy(score4Rep);
        p.setRepCeiling(repCeiling);
        return p;
    });
};
var calculatePartyListMemberCount = function (_a) {
    var parties = _a.parties, remainingPartyListSeat = _a.remainingPartyListSeat, totalPartyListMember = _a.totalPartyListMember;
    var newRemainingPartyListSeat = remainingPartyListSeat;
    var newTotalPartyListMember = totalPartyListMember;
    var result = parties.map(function (p) {
        // § 128(3)
        var repCeilingDecimal = p.getRepCeilingDecimal();
        var expectRep = repCeilingDecimal.minus(p.electedMemberCount);
        // § 128(4)
        var partyListMemberCountDecimal = bignumber_js_1.default.minimum(p.partyListCandidateCount, bignumber_js_1.default.maximum(expectRep, 0));
        var partyListMemberCount = partyListMemberCountDecimal
            .integerValue(bignumber_js_1.default.ROUND_FLOOR)
            .toNumber();
        newRemainingPartyListSeat -= partyListMemberCount;
        newTotalPartyListMember += partyListMemberCount;
        p.partyListMemberCount = partyListMemberCount;
        p.partyListMemberCountDecimal = partyListMemberCountDecimal;
        return p;
    });
    return {
        parties: result,
        remainingPartyListSeat: newRemainingPartyListSeat,
        totalPartyListMember: newTotalPartyListMember,
    };
};
// § 128(7)
var rebalancePartyListMember = function (_a) {
    var parties = _a.parties, totalPartyListMember = _a.totalPartyListMember;
    var newRemainingPartyListSeat = exports.PARTY_LIST_LIMIT;
    var newTotalPartyListMember = 0;
    var result = parties.map(function (p) {
        var tempPartyListMemberCount = p.partyListMemberCountDecimal;
        var newRepCeiling = tempPartyListMemberCount
            .multipliedBy(exports.PARTY_LIST_LIMIT)
            .dividedBy(new bignumber_js_1.default(totalPartyListMember));
        var partyListMemberCount = newRepCeiling
            .integerValue(bignumber_js_1.default.ROUND_FLOOR)
            .toNumber();
        p.setRemainderForSorting(newRepCeiling.minus(partyListMemberCount));
        newRemainingPartyListSeat -= partyListMemberCount;
        newTotalPartyListMember += partyListMemberCount;
        p.partyListMemberCount = partyListMemberCount;
        return p;
    });
    return {
        parties: result,
        remainingPartyListSeat: newRemainingPartyListSeat,
        totalPartyListMember: newTotalPartyListMember,
    };
};
// § 128(6)
var compareParty = function (a, b) {
    var aRemainder = a.getRemainderForSorting();
    var bRemainder = b.getRemainderForSorting();
    var aRepCeiling = a.getRepCeilingInt().toNumber();
    var bRepCeiling = b.getRepCeilingInt().toNumber();
    var aTempValue = a.voteCount / aRepCeiling;
    var bTempValue = b.voteCount / bRepCeiling;
    return aRemainder.isGreaterThan(bRemainder)
        ? -1
        : aRemainder.isLessThan(bRemainder)
            ? 1
            : aTempValue > bTempValue
                ? -1
                : 1;
};
// § 128(6)
var distributeRemainingSeats = function (_a, originalIds) {
    var parties = _a.parties, remainingPartyListSeat = _a.remainingPartyListSeat, totalPartyListMember = _a.totalPartyListMember;
    var newRemainingPartyListSeat = remainingPartyListSeat;
    var newTotalPartyListMember = totalPartyListMember;
    var clonedParties = parties;
    clonedParties.sort(compareParty);
    var index = 0;
    var viableParties = clonedParties;
    while (newRemainingPartyListSeat > 0 && viableParties.length > 0) {
        if (index === 0) {
            viableParties = viableParties.filter(function (p) {
                return p.isViableForPartyList() &&
                    p.partyListCandidateCount > p.partyListMemberCount;
            });
        }
        var viablePartiesIndex = index % viableParties.length;
        var viableParty = viableParties[viablePartiesIndex];
        viableParty.partyListMemberCount += 1;
        index += 1;
        newRemainingPartyListSeat -= 1;
        newTotalPartyListMember += 1;
        if (index === viableParties.length)
            index = 0;
    }
    var sortedParties = originalIds.map(function (id) { return clonedParties.filter(function (party) { return party.id === id; })[0]; });
    return {
        parties: sortedParties,
        remainingPartyListSeat: newRemainingPartyListSeat,
        totalPartyListMember: newTotalPartyListMember,
    };
};
var Party = /** @class */ (function () {
    function Party(_a) {
        var id = _a.id, electedMemberCount = _a.electedMemberCount, voteCount = _a.voteCount, partyListCandidateCount = _a.partyListCandidateCount;
        var _this = this;
        this.partyListMemberCount = 0;
        this.partyListMemberCountDecimal = new bignumber_js_1.default(0);
        this.representativeCeiling = new bignumber_js_1.default(0);
        this.remainderForSorting = new bignumber_js_1.default(0);
        this.isViableForPartyList = function () {
            var repCeilingIntValue = _this.getRepCeilingInt().toNumber();
            return repCeilingIntValue > _this.electedMemberCount;
        };
        this.setRepCeiling = function (ceiling) {
            _this.representativeCeiling = ceiling;
            var intValue = _this.getRepCeilingInt();
            _this.setRemainderForSorting(_this.representativeCeiling.minus(intValue));
        };
        this.getRepCeilingInt = function () {
            return _this.representativeCeiling.integerValue(bignumber_js_1.default.ROUND_FLOOR);
        };
        this.getRepCeilingDecimal = function () { return _this.representativeCeiling; };
        this.setRemainderForSorting = function (remainder) {
            _this.remainderForSorting = remainder;
        };
        this.getRemainderForSorting = function () { return _this.remainderForSorting; };
        this.id = id;
        this.electedMemberCount = electedMemberCount;
        this.voteCount = voteCount;
        this.partyListCandidateCount = partyListCandidateCount;
        this.partyListMemberCount = 0;
    }
    return Party;
}());
exports.Party = Party;
