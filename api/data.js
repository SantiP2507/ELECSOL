// ELECSOL — CND SITR proxy
// Proxies the public real-time feeds from Panama's Centro Nacional de Despacho (CND/ETESA)
// so the dashboard can fetch them without CORS issues.
// Source citation required by Ley No. 6 de 1997: EMPRESA DE TRANSMISIÓN ELÉCTRICA, S.A. (ETESA)

const FEEDS = {
  gen: "https://sitr.cnd.com.pa/m/pub/data/gen.json",
  vert: "https://sitr.cnd.com.pa/m/pub/data/vert.json",
};

export default async function handler(req, res) {
  const key = (req.query.f || "gen").toString();
  const url = FEEDS[key];

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (!url) {
    res.status(400).json({ error: "unknown_feed", feeds: Object.keys(FEEDS) });
    return;
  }

  try {
    const upstream = await fetch(`${url}?t=${Date.now()}`, {
      headers: { "cache-control": "no-cache", pragma: "no-cache" },
    });
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    const data = await upstream.json();

    // Cache at the edge for 60s so we never hammer CND.
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: "upstream_failed", detail: String(err) });
  }
}
