export interface GetWaitlistRecordResponse {
  numberOfReferrals: number;
  numberOfVerifiedReferrals: number;
  waitlistRank: number;
}

export interface ReferralRankQueryResult {
  referralcount: number;
  rownumber: number;
  verifiedreferralcount: number;
}