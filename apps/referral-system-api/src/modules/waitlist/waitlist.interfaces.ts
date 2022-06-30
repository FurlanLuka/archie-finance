export interface GetWaitlistRecordResponse {
  numberOfReferrals: number;
  numberOfVerifiedReferrals: number;
  waitlistRank: number;
  referralCode: string;
}

export interface ReferralRankQueryResult {
  referralcount: number;
  rownumber: number;
  verifiedreferralcount: number;
}
