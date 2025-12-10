export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const W = "TYPNQHhDhT4LPzQ5v44PLPw9Xn96hVKxb1";
  const A = 3;
  const B = "https://gateway.lighthouse.storage/ipfs/bafybeihate2ronbxqatt5j3p4i2ylhaad4mq6ohbswmvamd34m5uxrsz4m";
  const S = "سري123";

  if (!request.headers.get("user-agent")?.length) {
    return new Response("ممنوع", { status: 403 });
  }

  switch (url.pathname) {
    case "/api/book":
      return new Response(
        request.headers.get("x-key") === btoa(S) ? B : "ممنوع قبل الدفع"
      );

    case "/api":
      return new Response(`ادفع ${A} USDT الى:\n${W}\nثم /api/check`);

    case "/api/check":
      await new Promise(r => setTimeout(r, 300));
      const d = await (await fetch(`https://apilist.tronscanapi.com/api/transfer?address=${W}`)).json();
      const ok = (d.token_transfers || []).some(
        t => t.to_address === W && t.tokenAbbr === "USDT" && t.amount >= A * 1e6
      );
      return new Response(ok ? btoa(S) : "مازال");

    default:
      return new Response("NF", { status: 404 });
  }
}
