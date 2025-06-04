import {TappdClient} from '@phala/dstack-sdk'
import { toKeypairSecure } from '@phala/dstack-sdk/solana'

export const dynamic = 'force-dynamic'

export async function GET() {
  const client = new TappdClient()
  const testDeriveKey = await client.deriveKey("solana");
  const account = toKeypairSecure(testDeriveKey);
  console.log(account);
  return Response.json({ address: account.publicKey.toBase58() });
}
