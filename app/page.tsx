import Link from "next/link";
import { getFeaturedArticles } from "@/lib/articles";
import { quizzes } from "@/lib/quiz-data";
import { getMatches, getUpcomingMatches, getFeaturedMatchDetail, getTransferredPlayerIds, getStandings, getScorers } from "@/lib/football-api";
import { convertToJSTMedium } from "@/lib/utils";
import { calcPointsTimeline } from "@/lib/chart-utils";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/lib/metadata";
import TitleRaceChart from "@/components/TitleRaceChart";
import FeaturedMatchCard, { buildRecentMatches } from "@/components/FeaturedMatchCard";
import TickerBar from "@/components/ui/TickerBar";
import { FEATURED_MATCH_CONFIG, type FeaturedMatchConfig } from "@/lib/match-preview-data";

export const revalidate = 1800;

export const metadata = createMetadata(
  "PremierNow - プレミアリーグ データ分析",
  "プレミアリーグの順位表・試合結果・得点王・データ分析を日本語で。毎節更新。",
  "/",
  undefined,
  "website",
  "/og-home.png",
);

export default async function Home() {
  // playerId が設定されている選手の移籍チェック用IDを事前抽出
  const homePlayerIds = FEATURED_MATCH_CONFIG.homeInjuries
    .map((i) => i.playerId)
    .filter((id): id is number => id !== undefined);
  const awayPlayerIds = FEATURED_MATCH_CONFIG.awayInjuries
    .map((i) => i.playerId)
    .filter((id): id is number => id !== undefined);

  const [featuredArticles, matchesData, upcomingRaw, featuredMatchDetail, homeTransferred, awayTransferred, standingsData, scorersData] =
    await Promise.all([
      Promise.resolve(getFeaturedArticles()),
      getMatches({ status: "FINISHED" }).catch(() => ({ matches: [] as import("@/types/football").Match[] })),
      getUpcomingMatches(3).catch(() => [] as import("@/types/football").Match[]),
      getFeaturedMatchDetail(
        FEATURED_MATCH_CONFIG.homeTeamId,
        FEATURED_MATCH_CONFIG.awayTeamId,
      ).catch(() => null),
      getTransferredPlayerIds(homePlayerIds, FEATURED_MATCH_CONFIG.homeTeamId).catch(() => new Set<number>()),
      getTransferredPlayerIds(awayPlayerIds, FEATURED_MATCH_CONFIG.awayTeamId).catch(() => new Set<number>()),
      getStandings().catch(() => null),
      getScorers().catch(() => null),
    ]);

  // 移籍済み選手を除外した負傷者リスト
  const homeInjuries = FEATURED_MATCH_CONFIG.homeInjuries
    .filter((i) => !i.playerId || !homeTransferred.has(i.playerId));
  const awayInjuries = FEATURED_MATCH_CONFIG.awayInjuries
    .filter((i) => !i.playerId || !awayTransferred.has(i.playerId));

  const standingsTable = standingsData?.standings[0]?.table ?? [];
  const topScorer = scorersData?.scorers[0] ?? null;
  const titleGap = standingsTable.length >= 2 ? standingsTable[0].points - standingsTable[1].points : 0;

  const timelines = calcPointsTimeline(matchesData.matches ?? []);

  const sortedFinished = [...(matchesData.matches ?? [])]
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());

  const recentMatches = sortedFinished.slice(0, 3);
  const tickerMatches = sortedFinished.slice(0, 10);

  const recentIds = new Set(recentMatches.map((m) => m.id));
  const upcomingMatches = upcomingRaw.filter((m) => !recentIds.has(m.id));

  // 注目カード: API データと injuries をマージ
  const allFinished = matchesData.matches ?? [];
  let featuredMatch: FeaturedMatchConfig | null = null;
  let homeForm: string[] = [];
  let awayForm: string[] = [];
  let homeRecentMatches: ReturnType<typeof buildRecentMatches> = [];
  let awayRecentMatches: ReturnType<typeof buildRecentMatches> = [];

  if (featuredMatchDetail) {
    const homeId = featuredMatchDetail.homeTeam.id;
    const awayId = featuredMatchDetail.awayTeam.id;

    homeForm = allFinished
      .filter((m) => m.homeTeam.id === homeId || m.awayTeam.id === homeId)
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 5)
      .reverse()
      .map((m) => {
        const isHome = m.homeTeam.id === homeId;
        const h = m.score.fullTime.home ?? 0;
        const a = m.score.fullTime.away ?? 0;
        if (h === a) return "D";
        return isHome ? (h > a ? "W" : "L") : (a > h ? "W" : "L");
      });

    awayForm = allFinished
      .filter((m) => m.homeTeam.id === awayId || m.awayTeam.id === awayId)
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 5)
      .reverse()
      .map((m) => {
        const isHome = m.homeTeam.id === awayId;
        const h = m.score.fullTime.home ?? 0;
        const a = m.score.fullTime.away ?? 0;
        if (h === a) return "D";
        return isHome ? (h > a ? "W" : "L") : (a > h ? "W" : "L");
      });

    homeRecentMatches = buildRecentMatches(homeId, allFinished);
    awayRecentMatches = buildRecentMatches(awayId, allFinished);

    featuredMatch = {
      apiMatchId: featuredMatchDetail.id,
      matchId: FEATURED_MATCH_CONFIG.quizSlug,
      homeTeam: {
        ...featuredMatchDetail.homeTeam,
        injuries: homeInjuries,
      },
      awayTeam: {
        ...featuredMatchDetail.awayTeam,
        injuries: awayInjuries,
      },
      utcDate: featuredMatchDetail.utcDate,
      matchday: featuredMatchDetail.matchday,
      venue: featuredMatchDetail.venue ?? "セント・ジェームズ・パーク",
      status: featuredMatchDetail.status,
      liveScore: featuredMatchDetail.score,
      goals: featuredMatchDetail.goals ?? [],
      quizSlug: FEATURED_MATCH_CONFIG.quizSlug,
      previewArticleSlug: FEATURED_MATCH_CONFIG.previewArticleSlug,
      scorePrediction: FEATURED_MATCH_CONFIG.scorePrediction,
    };
  }

  return (
    <main className="min-h-screen bg-pn-bg dark:bg-gray-950">
      <TickerBar matches={tickerMatches} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PremierNow",
          url: "https://premiernow.jp",
          description: "プレミアリーグのデータ分析サイト",
          inLanguage: "ja",
        }}
      />
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">

        {/* 1. ミニ順位表（案3）左 + Hero Stats（案4）右 */}
        {standingsTable.length > 0 && (
          <div className="grid grid-cols-11 gap-3 items-stretch">

            {/* 左6/11: ミニ順位表 */}
            <section className="col-span-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-violet-600 rounded inline-block" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">順位</p>
                </div>
                <Link href="/standings" className="text-[10px] text-pn-blue hover:underline whitespace-nowrap">
                  全20 →
                </Link>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="py-1.5 w-7 text-center font-medium">#</th>
                    <th className="py-1.5 text-left font-medium pl-1">クラブ</th>
                    <th className="pr-2 py-1.5 text-right font-medium w-7">P</th>
                    <th className="pr-2 py-1.5 text-right font-medium w-9">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standingsTable.slice(0, 5).map((s, idx) => (
                    <tr
                      key={s.team.id}
                      className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-2 w-7">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`w-0.5 h-3.5 rounded flex-shrink-0 ${idx < 4 ? "bg-blue-500" : "bg-orange-400"}`} />
                          <span className="font-mono tabular-nums text-gray-500 dark:text-gray-400">{s.position}</span>
                        </div>
                      </td>
                      <td className="py-2 pl-1">
                        <Link href={`/teams/${s.team.id}`} className="flex items-center gap-1 hover:opacity-75 transition-opacity">
                          {s.team.crest && (
                            <img src={s.team.crest} alt="" className="w-3.5 h-3.5 object-contain flex-shrink-0" />
                          )}
                          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{s.team.shortName}</span>
                        </Link>
                      </td>
                      <td className="pr-2 py-2 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">{s.playedGames}</td>
                      <td className="pr-2 py-2 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-gray-100">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* 右5/11: Hero Stats（縦3枚） */}
            <div className="col-span-5 flex flex-col gap-2 h-full">

              {/* 首位 */}
              <Link href="/standings" className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm px-4 py-3 flex items-center justify-between hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">首位</p>
                  <div className="flex items-center gap-1.5">
                    {standingsTable[0]?.team.crest && (
                      <img src={standingsTable[0].team.crest} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                      {standingsTable[0]?.team.shortName}
                    </span>
                  </div>
                </div>
                <p className="font-mono tabular-nums text-xl font-bold text-violet-600">
                  {standingsTable[0]?.points}
                  <span className="text-[11px] font-normal text-gray-400 ml-0.5">pt</span>
                </p>
              </Link>

              {/* 得点王 */}
              <Link href="/players" className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm px-4 py-3 flex items-center justify-between hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">得点王</p>
                  <div className="flex items-center gap-1.5">
                    {topScorer?.team.crest && (
                      <img src={topScorer.team.crest} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                      {topScorer ? topScorer.player.name.split(" ").slice(-1)[0] : "—"}
                    </span>
                  </div>
                </div>
                <p className="font-mono tabular-nums text-xl font-bold text-violet-600">
                  {topScorer?.goals ?? "—"}
                  {topScorer && <span className="text-[11px] font-normal text-gray-400 ml-0.5">G</span>}
                </p>
              </Link>

              {/* 首位-2位差 */}
              <Link href="/charts/race" className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm px-4 py-3 flex items-center justify-between hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">首位-2位</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">タイトルレース</p>
                </div>
                <p className="font-mono tabular-nums text-xl font-bold text-violet-600">
                  {titleGap === 0 ? "同点" : `+${titleGap}`}
                  {titleGap > 0 && <span className="text-[11px] font-normal text-gray-400 ml-0.5">pt</span>}
                </p>
              </Link>

            </div>

          </div>
        )}

        {/* 3. 注目データ */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-[#00a8e8] rounded inline-block" />
              <p className="text-sm font-semibold text-[#2d0a4e] dark:text-gray-100">Editor's Pick <span>いま注目のデータ</span></p>
            </div>
            <Link href="/standings" className="text-xs text-[#00a8e8] hover:underline">
              順位表を見る →
            </Link>
          </div>
          <div className="p-4">
            <TitleRaceChart timelines={timelines} />
          </div>
        </section>

        {/* 4. 注目カード */}
        {featuredMatch && (
          <FeaturedMatchCard
            config={featuredMatch}
            homeForm={homeForm}
            awayForm={awayForm}
            homeRecentMatches={homeRecentMatches}
            awayRecentMatches={awayRecentMatches}
          />
        )}

        {/* 5. クイズ ＋ 記事（横2列） */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">

          {/* 左：ピックアップクイズ */}
          <section className="bg-[#e6f6fd] dark:bg-blue-950/30 border border-[#00a8e8] dark:border-blue-500/50 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-[#00a8e8] rounded inline-block" />
                <p className="text-sm font-semibold text-[#2d0a4e] dark:text-gray-100">クイズに挑戦</p>
              </div>
              <Link href="/articles/quiz" className="text-xs text-[#00a8e8] hover:underline">
                すべて見る →
              </Link>
            </div>
            {quizzes[0] && (
              <Link
                href={`/articles/quiz/${quizzes[0].slug}`}
                className="block bg-white dark:bg-gray-900 border border-[#00a8e8] dark:border-blue-500/60 rounded p-4 hover:bg-[#f0faff] dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-pn-blue-light dark:bg-blue-900/50 text-pn-navy dark:text-blue-300 px-2 py-0.5 rounded">
                    クイズ
                  </span>
                  <span className="text-xs text-gray-400">全{quizzes[0].questions.length}問</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                  {quizzes[0].title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {quizzes[0].description}
                </p>
                <p className="text-[#00a8e8] font-medium text-sm mt-2">挑戦する →</p>
              </Link>
            )}
          </section>

          {/* 右：ピックアップ記事 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-[#00a8e8] rounded inline-block" />
                <p className="text-sm font-semibold text-[#2d0a4e] dark:text-gray-100">ピックアップ記事</p>
              </div>
              <Link href="/articles" className="text-xs text-[#00a8e8] hover:underline">
                すべて見る →
              </Link>
            </div>
            {featuredArticles.length === 0 ? (
              <p className="text-sm text-gray-400">記事を準備中です。</p>
            ) : (
              <div className="space-y-2">
                {featuredArticles.slice(0, 2).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 hover:border-pn-blue dark:hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm hover:text-pn-blue leading-snug">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{article.description}</p>
                    <div className="flex items-center flex-wrap gap-2 mt-2 text-xs text-gray-400">
                      <span>{article.publishedAt}</span>
                      <span>{article.readingTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* 6. 試合情報 2カラム */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

          {/* 次の試合（SP: 上、PC: 右） */}
          <section className="order-first md:order-last">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                次の試合
              </p>
              <Link href="/matches" className="text-xs text-pn-blue hover:underline">
                すべて見る →
              </Link>
            </div>
            {upcomingMatches.length === 0 ? (
              <p className="text-sm text-gray-400">試合予定がありません。</p>
            ) : (
              <div className="space-y-2">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {convertToJSTMedium(match.utcDate)}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-mono tabular-nums">
                        第{match.matchday}節
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-0 w-full">
                      <Link href={`/teams/${match.homeTeam.id}`} className="flex items-center justify-end gap-1.5 w-[120px] flex-shrink-0 hover:opacity-75 transition-opacity">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate text-right">
                          {match.homeTeam.shortName}
                        </span>
                        {match.homeTeam.crest && (
                          <img src={match.homeTeam.crest} alt="" className="w-[18px] h-[18px] object-contain flex-shrink-0" />
                        )}
                      </Link>
                      <div className="w-[56px] text-center flex-shrink-0">
                        <span className="text-xs text-gray-400">vs</span>
                      </div>
                      <Link href={`/teams/${match.awayTeam.id}`} className="flex items-center justify-start gap-1.5 w-[120px] flex-shrink-0 hover:opacity-75 transition-opacity">
                        {match.awayTeam.crest && (
                          <img src={match.awayTeam.crest} alt="" className="w-[18px] h-[18px] object-contain flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                          {match.awayTeam.shortName}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 直近の結果（SP: 下、PC: 左） */}
          <section className="order-last md:order-first">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                直近の結果
              </p>
              <Link href="/matches" className="text-xs text-pn-blue hover:underline">
                すべて見る →
              </Link>
            </div>
            {recentMatches.length === 0 ? (
              <p className="text-sm text-gray-400">試合データがありません。</p>
            ) : (
              <div className="space-y-2">
                {recentMatches.map((match) => (
                  <div key={match.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {convertToJSTMedium(match.utcDate)}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-mono tabular-nums">
                        第{match.matchday}節
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-0 w-full">
                      <Link href={`/teams/${match.homeTeam.id}`} className="flex items-center justify-end gap-1.5 w-[120px] flex-shrink-0 hover:opacity-75 transition-opacity">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate text-right">
                          {match.homeTeam.shortName}
                        </span>
                        {match.homeTeam.crest && (
                          <img src={match.homeTeam.crest} alt="" className="w-[18px] h-[18px] object-contain flex-shrink-0" />
                        )}
                      </Link>
                      <Link href={`/matches/${match.id}`} className="w-[56px] text-center flex-shrink-0 hover:opacity-75 transition-opacity">
                        <span className="font-mono font-bold text-sm text-gray-900 dark:text-gray-100">
                          {match.score.fullTime.home} - {match.score.fullTime.away}
                        </span>
                      </Link>
                      <Link href={`/teams/${match.awayTeam.id}`} className="flex items-center justify-start gap-1.5 w-[120px] flex-shrink-0 hover:opacity-75 transition-opacity">
                        {match.awayTeam.crest && (
                          <img src={match.awayTeam.crest} alt="" className="w-[18px] h-[18px] object-contain flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                          {match.awayTeam.shortName}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

      </div>
    </main>
  );
}
