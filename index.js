export default {
  async fetch(request) {
    const url = new URL(request.url);
    const WALLET = "TYPNQHhDhT4LPzQ5v44PLPw9Xn96hVKxb1";
    const AMOUNT = 3;
    const BOOK_URL = "https://gateway.lighthouse.storage/ipfs/bafybeihate2ronbxqatt5j3p4i2ylhaad4mq6ohbswmvamd34m5uxrsz4m";

    if (url.pathname === "/")
      return new Response(
        `ادفع ${AMOUNT} USDT (TRC20) إلى:\n${WALLET}\n\nبعد الدفع ادخل إلى /check`,
        { headers: { "Content-Type": "text/plain" } }
      );

    if (url.pathname === "/check") {
      const api = `https://apilist.tronscanapi.com/api/transfer?address=${WALLET}&limit=20`;
      const res = await fetch(api);
      const data = await res.json();

      const paid = (data.token_transfers || []).some(tx =>
        tx.to_address === WALLET &&
        tx.tokenAbbr === "USDT" &&
        Number(tx.amount) === AMOUNT * 1_000_000
      );

      return new Response(
        paid ? `✅ الدفع وصل!\nرابط الكتاب:\n${BOOK_URL}`
             : `❌ الدفع مازال ما وصلش.\nعاود جرّب بعد دقيقة.`,
        { headers: { "Content-Type": "text/plain" } }
      );
    }

    return new Response("Not Found", { status: 404 });
  }
};
