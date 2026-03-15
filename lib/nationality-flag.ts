/**
 * football-data.org の nationality フィールドは
 * 国名（"Norway"）または ISO 3166-1 alpha-2 国コード（"NO"）のどちらかで返ってくる場合がある。
 * コードポイント生成に頼らず、国コード → 国旗絵文字を直接マッピングする方式で対応。
 */

/** ISO 3166-1 alpha-2 国コード → 国旗絵文字 */
const FLAG_MAP: Record<string, string> = {
  NO: "🇳🇴", GB: "🇬🇧", FR: "🇫🇷", BR: "🇧🇷",
  PT: "🇵🇹", ES: "🇪🇸", DE: "🇩🇪", AR: "🇦🇷",
  NL: "🇳🇱", BE: "🇧🇪", SE: "🇸🇪", DK: "🇩🇰",
  GH: "🇬🇭", SN: "🇸🇳", NG: "🇳🇬", CM: "🇨🇲",
  EG: "🇪🇬", JP: "🇯🇵", KR: "🇰🇷", AU: "🇦🇺",
  IE: "🇮🇪", HR: "🇭🇷", RS: "🇷🇸", SK: "🇸🇰",
  CZ: "🇨🇿", PL: "🇵🇱", CH: "🇨🇭", AT: "🇦🇹",
  IT: "🇮🇹", UY: "🇺🇾", CO: "🇨🇴", EC: "🇪🇨",
  JM: "🇯🇲", US: "🇺🇸", CA: "🇨🇦", MA: "🇲🇦",
  DZ: "🇩🇿", CI: "🇨🇮", ML: "🇲🇱", GN: "🇬🇳",
  TR: "🇹🇷", GR: "🇬🇷", RO: "🇷🇴", HU: "🇭🇺",
  UA: "🇺🇦", MX: "🇲🇽", CL: "🇨🇱", PE: "🇵🇪",
  VE: "🇻🇪", PY: "🇵🇾", BO: "🇧🇴", CR: "🇨🇷",
  TT: "🇹🇹", NZ: "🇳🇿", FI: "🇫🇮", IS: "🇮🇸",
  ZA: "🇿🇦", KE: "🇰🇪", TZ: "🇹🇿", ZM: "🇿🇲",
};

/** 国名 → ISO 3166-1 alpha-2 国コード */
const NATIONALITY_TO_CODE: Record<string, string> = {
  Norway: "NO", England: "GB", France: "FR", Brazil: "BR",
  Portugal: "PT", Spain: "ES", Germany: "DE", Argentina: "AR",
  Netherlands: "NL", Belgium: "BE", Sweden: "SE", Denmark: "DK",
  Ghana: "GH", Senegal: "SN", Nigeria: "NG", Cameroon: "CM",
  Egypt: "EG", Japan: "JP", "South Korea": "KR", Australia: "AU",
  Scotland: "GB", Wales: "GB", Ireland: "IE", Croatia: "HR",
  Serbia: "RS", Slovakia: "SK", "Czech Republic": "CZ", Poland: "PL",
  Switzerland: "CH", Austria: "AT", Italy: "IT", Uruguay: "UY",
  Colombia: "CO", Ecuador: "EC", Jamaica: "JM", "United States": "US",
  Canada: "CA", Morocco: "MA", Algeria: "DZ", "Ivory Coast": "CI",
  Mali: "ML", Guinea: "GN", Turkey: "TR", Greece: "GR",
  Romania: "RO", Hungary: "HU", Ukraine: "UA", Mexico: "MX",
  Chile: "CL", Peru: "PE", Venezuela: "VE", Paraguay: "PY",
  Bolivia: "BO", "Costa Rica": "CR", "Trinidad and Tobago": "TT",
  "New Zealand": "NZ", Finland: "FI", Iceland: "IS",
  "South Africa": "ZA", Kenya: "KE", Tanzania: "TZ", Zambia: "ZM",
};

/**
 * football-data.org の nationality 文字列から国旗絵文字を返す。
 * 国名・ISO 3166-1 alpha-2 コードのどちらにも対応。
 * 対応する国旗がない場合は 🏳️ を返す。
 */
export function getFlagEmoji(nationality: string): string {
  if (!nationality) return "🏳️";

  // 2文字の国コードが直接来た場合（例: "GH", "CM"）
  if (nationality.length === 2) {
    return FLAG_MAP[nationality.toUpperCase()] ?? "🏳️";
  }

  // 国名から国コードを引いて国旗を返す
  const code = NATIONALITY_TO_CODE[nationality];
  if (code) return FLAG_MAP[code] ?? "🏳️";

  return "🏳️";
}
