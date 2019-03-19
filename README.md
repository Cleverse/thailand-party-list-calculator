# Thailand Party List Calculator

According to Constitution of Kingdom of Thailand 2017, the election system
adopts Mixed Members Appointment system (MMA) to make sure that the people's
vote percentage reflects the percentage of each party in House of
Representatives.

This code implementation is based on Organic Act on the Election of Members of
the House of Representatives, B.E. 2561 (2018)
([	พระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2561](https://www.ect.go.th/ect_th/ewt_dl_link.php?nid=4230))

## Disclaimer

This is not the official software. We do not hold any responsibility for any
mistake in any law interpretation or logic implementation.

## Installation

`npm install thailand-party-list-calculator`

or

`yarn add thailand-party-list-calculator`

## Usage

```javascript
const parties = calculatePartyList([
  {
    id: "1", // Unique ID
    electedMemberCount: 100, // Number of constituency candates of the party
    voteCount: 1000, // Total number of vote of the party
    partyListCandidateCount: 150 // Number of party list candidates of the party
  },
  {
    ...
  }
])

// parties[0].partyListMemberCount
```
