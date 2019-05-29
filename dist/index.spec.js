"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var assert = require("assert");
describe('Thailand Election Party List Calculation', function () {
    it('should pass monopoly case', function () {
        var parties = index_1.calculatePartyList([
            {
                id: '1',
                electedMemberCount: 350,
                voteCount: 1000,
                partyListCandidateCount: 150,
            },
        ]);
        assert.equal(parties.length, 1);
        assert.equal(parties[0].partyListMemberCount, 150);
    });
    it('should split equally between 2 parties', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 75);
        assert.equal(parties[1].partyListMemberCount, 75);
    });
    it('should exclude parties not submitting candidate', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 150);
        assert.equal(parties[1].partyListMemberCount, 0);
    });
    it('should exclude parties not reaching minimum votes', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 150);
        assert.equal(parties[1].partyListMemberCount, 0);
    });
    it('should consider parties submitting limited party-list candidates', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 130);
        assert.equal(parties[1].partyListMemberCount, 20);
    });
    it('should exclude party with exceeded elected members', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 2);
        assert.equal(parties[0].partyListMemberCount, 0);
        assert.equal(parties[1].partyListMemberCount, 150);
    });
    it('should distribute seat to party having greatest remaining and candidate available', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 6);
        assert.equal(parties[0].partyListMemberCount, 40);
        assert.equal(parties[1].partyListMemberCount, 34);
        assert.equal(parties[2].partyListMemberCount, 25);
        assert.equal(parties[3].partyListMemberCount, 26);
        assert.equal(parties[4].partyListMemberCount, 25);
        assert.equal(parties[5].partyListMemberCount, 0);
    });
    it('should distribute remaining seats when some remainders are equal', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 6);
        assert.equal(parties[0].partyListMemberCount, 89);
        assert.equal(parties[1].partyListMemberCount, 21);
        assert.equal(parties[2].partyListMemberCount, 3);
        assert.equal(parties[3].partyListMemberCount, 10);
        assert.equal(parties[4].partyListMemberCount, 10);
        assert.equal(parties[5].partyListMemberCount, 17);
    });
    it('should rebalance when party list members count exceeds limit then distribute', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 6);
        assert.equal(parties[0].partyListMemberCount, 127);
        assert.equal(parties[1].partyListMemberCount, 8);
        assert.equal(parties[2].partyListMemberCount, 0);
        assert.equal(parties[3].partyListMemberCount, 3);
        assert.equal(parties[4].partyListMemberCount, 4);
        assert.equal(parties[5].partyListMemberCount, 8);
    });
    it('should rebalance when party list members count exceeds limit then distribute when some remainders are equal', function () {
        var parties = index_1.calculatePartyList([
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
        ]);
        assert.equal(parties.length, 6);
        assert.equal(parties[0].partyListMemberCount, 129);
        assert.equal(parties[1].partyListMemberCount, 9);
        assert.equal(parties[2].partyListMemberCount, 0);
        assert.equal(parties[3].partyListMemberCount, 3);
        assert.equal(parties[4].partyListMemberCount, 3);
        assert.equal(parties[5].partyListMemberCount, 6);
    });
    it('correctly calculate real election 2019 data', function () {
        var parties = index_1.calculatePartyList([
            {
                id: 'พลังประชารัฐ',
                electedMemberCount: 97,
                voteCount: 8441274,
                partyListCandidateCount: 120,
            },
            {
                id: 'เพื่อไทย',
                electedMemberCount: 136,
                voteCount: 7881006,
                partyListCandidateCount: 97,
            },
            {
                id: 'อนาคตใหม่',
                electedMemberCount: 31,
                voteCount: 6330617,
                partyListCandidateCount: 124,
            },
            {
                id: 'ประชาธิปัตย์',
                electedMemberCount: 33,
                voteCount: 3959358,
                partyListCandidateCount: 150,
            },
            {
                id: 'ภูมิใจไทย',
                electedMemberCount: 39,
                voteCount: 3734459,
                partyListCandidateCount: 150,
            },
            {
                id: 'เสรีรวมไทย',
                electedMemberCount: 0,
                voteCount: 824284,
                partyListCandidateCount: 100,
            },
            {
                id: 'ชาติไทยพัฒนา',
                electedMemberCount: 6,
                voteCount: 783689,
                partyListCandidateCount: 67,
            },
            {
                id: 'เศรษฐกิจใหม่',
                electedMemberCount: 0,
                voteCount: 486273,
                partyListCandidateCount: 81,
            },
            {
                id: 'ประชาชาติ',
                electedMemberCount: 6,
                voteCount: 481490,
                partyListCandidateCount: 58,
            },
            {
                id: 'เพื่อชาติ',
                electedMemberCount: 0,
                voteCount: 421412,
                partyListCandidateCount: 150,
            },
            {
                id: 'รวมพลังฯ',
                electedMemberCount: 1,
                voteCount: 415585,
                partyListCandidateCount: 150,
            },
            {
                id: 'ชาติพัฒนา',
                electedMemberCount: 1,
                voteCount: 244770,
                partyListCandidateCount: 56,
            },
            {
                id: 'พลังท้องถิ่นไท',
                electedMemberCount: 0,
                voteCount: 214189,
                partyListCandidateCount: 78,
            },
            {
                id: 'รักษ์ผืนป่าฯ',
                electedMemberCount: 0,
                voteCount: 134816,
                partyListCandidateCount: 16,
            },
            {
                id: 'พลังปวงชนไทย',
                electedMemberCount: 0,
                voteCount: 80186,
                partyListCandidateCount: 62,
            },
            {
                id: 'พลังชาติไทย',
                electedMemberCount: 0,
                voteCount: 73421,
                partyListCandidateCount: 77,
            },
            {
                id: 'ประชาภิวัฒน์',
                electedMemberCount: 0,
                voteCount: 69431,
                partyListCandidateCount: 129,
            },
            {
                id: 'ไทยศรีวิไลย์',
                electedMemberCount: 0,
                voteCount: 60354,
                partyListCandidateCount: 26,
            },
            {
                id: 'พลังไทยรักไทย',
                electedMemberCount: 0,
                voteCount: 60434,
                partyListCandidateCount: 30,
            },
            {
                id: 'ครูไทยฯ',
                electedMemberCount: 0,
                voteCount: 56633,
                partyListCandidateCount: 82,
            },
            {
                id: 'ประชานิยม',
                electedMemberCount: 0,
                voteCount: 56264,
                partyListCandidateCount: 112,
            },
            {
                id: 'ประชาธรรมไทย',
                electedMemberCount: 0,
                voteCount: 48037,
                partyListCandidateCount: 61,
            },
            {
                id: 'ประชาชนปฏิรูป',
                electedMemberCount: 0,
                voteCount: 45420,
                partyListCandidateCount: 40,
            },
            {
                id: 'พลเมืองไทย',
                electedMemberCount: 0,
                voteCount: 44961,
                partyListCandidateCount: 18,
            },
            {
                id: 'ประชาธิปไตย์ใหม่',
                electedMemberCount: 0,
                voteCount: 39260,
                partyListCandidateCount: 41,
            },
            {
                id: 'พลังธรรมใหม่',
                electedMemberCount: 0,
                voteCount: 35099,
                partyListCandidateCount: 24,
            },
            {
                id: 'ไทรักธรรม',
                electedMemberCount: 0,
                voteCount: 33787,
                partyListCandidateCount: 148,
            },
            {
                id: 'เพื่อแผ่นดิน',
                electedMemberCount: 0,
                voteCount: 30936,
                partyListCandidateCount: 28,
            },
            {
                id: 'ทางเลือกใหม่',
                electedMemberCount: 0,
                voteCount: 29219,
                partyListCandidateCount: 13,
            },
            {
                id: 'ภราดรภาพ',
                electedMemberCount: 0,
                voteCount: 30253,
                partyListCandidateCount: 14,
            },
            {
                id: 'พลังประชาธิปไตย',
                electedMemberCount: 0,
                voteCount: 26693,
                partyListCandidateCount: 14,
            },
            {
                id: 'เพื่อคนไทย',
                electedMemberCount: 0,
                voteCount: 26559,
                partyListCandidateCount: 19,
            },
            {
                id: 'พลังไทสร้างชาติ',
                electedMemberCount: 0,
                voteCount: 23094,
                partyListCandidateCount: 12,
            },
            {
                id: 'กรีน',
                electedMemberCount: 0,
                voteCount: 22568,
                partyListCandidateCount: 15,
            },
            {
                id: 'แผ่นดินธรรม',
                electedMemberCount: 0,
                voteCount: 21212,
                partyListCandidateCount: 24,
            },
            {
                id: 'มหาชน',
                electedMemberCount: 0,
                voteCount: 17882,
                partyListCandidateCount: 11,
            },
            {
                id: 'พลังสังคม',
                electedMemberCount: 0,
                voteCount: 17563,
                partyListCandidateCount: 15,
            },
            {
                id: 'แทนคุณแผ่นดิน',
                electedMemberCount: 0,
                voteCount: 17205,
                partyListCandidateCount: 12,
            },
            {
                id: 'เครือข่ายชาวนาฯ',
                electedMemberCount: 0,
                voteCount: 17261,
                partyListCandidateCount: 9,
            },
            {
                id: 'สยามพัฒนา',
                electedMemberCount: 0,
                voteCount: 17075,
                partyListCandidateCount: 14,
            },
            {
                id: 'เพื่อธรรม',
                electedMemberCount: 0,
                voteCount: 15130,
                partyListCandidateCount: 2,
            },
            {
                id: 'รวมใจไทย',
                electedMemberCount: 0,
                voteCount: 13332,
                partyListCandidateCount: 9,
            },
            {
                id: 'คลองไทย',
                electedMemberCount: 0,
                voteCount: 12732,
                partyListCandidateCount: 27,
            },
            {
                id: 'ผึ้งหลวง',
                electedMemberCount: 0,
                voteCount: 12589,
                partyListCandidateCount: 18,
            },
            {
                id: 'ภาคีเครือข่ายไทย',
                electedMemberCount: 0,
                voteCount: 12256,
                partyListCandidateCount: 24,
            },
            {
                id: 'ประชากรไทย',
                electedMemberCount: 0,
                voteCount: 11434,
                partyListCandidateCount: 18,
            },
            {
                id: 'ประชาไท',
                electedMemberCount: 0,
                voteCount: 10984,
                partyListCandidateCount: 18,
            },
            {
                id: 'ชาติพันธุ์ไทย',
                electedMemberCount: 0,
                voteCount: 9913,
                partyListCandidateCount: 15,
            },
            {
                id: 'พลังไทยรักชาติ',
                electedMemberCount: 0,
                voteCount: 9643,
                partyListCandidateCount: 12,
            },
            {
                id: 'พลังศรัทธา',
                electedMemberCount: 0,
                voteCount: 9564,
                partyListCandidateCount: 8,
            },
            {
                id: 'ความหวังใหม่',
                electedMemberCount: 0,
                voteCount: 9046,
                partyListCandidateCount: 13,
            },
            {
                id: 'เพื่อไทยพัฒนา',
                electedMemberCount: 0,
                voteCount: 8063,
                partyListCandidateCount: 12,
            },
            {
                id: 'ถิ่นกาขาวฯ',
                electedMemberCount: 0,
                voteCount: 6814,
                partyListCandidateCount: 8,
            },
            {
                id: 'พลังครูไทย',
                electedMemberCount: 0,
                voteCount: 6390,
                partyListCandidateCount: 6,
            },
            {
                id: 'ไทยธรรม',
                electedMemberCount: 0,
                voteCount: 5811,
                partyListCandidateCount: 9,
            },
            {
                id: 'กลาง',
                electedMemberCount: 0,
                voteCount: 5459,
                partyListCandidateCount: 6,
            },
            {
                id: 'สังคมประชาธิปไตยไทย',
                electedMemberCount: 0,
                voteCount: 5347,
                partyListCandidateCount: 6,
            },
            {
                id: 'สามัญชน',
                electedMemberCount: 0,
                voteCount: 5291,
                partyListCandidateCount: 6,
            },
            {
                id: 'ฐานรากไทย',
                electedMemberCount: 0,
                voteCount: 4838,
                partyListCandidateCount: 14,
            },
            {
                id: 'พลังแผ่นดินทอง',
                electedMemberCount: 0,
                voteCount: 4586,
                partyListCandidateCount: 6,
            },
            {
                id: 'ไทยรุ่งเรือง',
                electedMemberCount: 0,
                voteCount: 4152,
                partyListCandidateCount: 7,
            },
            {
                id: 'พลังรัก',
                electedMemberCount: 0,
                voteCount: 4410,
                partyListCandidateCount: 6,
            },
            {
                id: 'ภูมิพลังเกษตรกรไทย',
                electedMemberCount: 0,
                voteCount: 3577,
                partyListCandidateCount: 5,
            },
            {
                id: 'พลังแรงงานไทย',
                electedMemberCount: 0,
                voteCount: 2940,
                partyListCandidateCount: 6,
            },
            {
                id: 'คนธรรมดาฯ',
                electedMemberCount: 0,
                voteCount: 2606,
                partyListCandidateCount: 2,
            },
            {
                id: 'พลังไทยดี',
                electedMemberCount: 0,
                voteCount: 2535,
                partyListCandidateCount: 6,
            },
            {
                id: 'พลังสหกรณ์',
                electedMemberCount: 0,
                voteCount: 2357,
                partyListCandidateCount: 4,
            },
            {
                id: 'เพื่อชีวิตใหม่',
                electedMemberCount: 0,
                voteCount: 1599,
                partyListCandidateCount: 3,
            },
            {
                id: 'พัฒนาประเทศไทย',
                electedMemberCount: 0,
                voteCount: 1093,
                partyListCandidateCount: 2,
            },
            {
                id: 'เพื่อสหกรณ์ไทย',
                electedMemberCount: 0,
                voteCount: 902,
                partyListCandidateCount: 2,
            },
            {
                id: 'มติประชา',
                electedMemberCount: 0,
                voteCount: 789,
                partyListCandidateCount: 1,
            },
            {
                id: 'ยางพาราไทย',
                electedMemberCount: 0,
                voteCount: 610,
                partyListCandidateCount: 4,
            },
            {
                id: 'ประชาธิปไตย์เพื่อประชาชน',
                electedMemberCount: 0,
                voteCount: 553,
                partyListCandidateCount: 3,
            },
            {
                id: 'กสิกรไทย',
                electedMemberCount: 0,
                voteCount: 182,
                partyListCandidateCount: 1,
            },
        ]);
        assert.equal(parties.length, 74);
        assert.deepEqual(parties.map(function (p) { return p.partyListMemberCount; }), [
            19,
            0,
            50,
            20,
            12,
            10,
            4,
            6,
            1,
            5,
            4,
            2,
            3,
            2,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
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
        ]);
    });
});
