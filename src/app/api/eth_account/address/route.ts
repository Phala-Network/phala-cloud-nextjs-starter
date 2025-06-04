import { TappdClient } from '@phala/dstack-sdk'
import { toViemAccountSecure } from '@phala/dstack-sdk/viem'

export const dynamic = 'force-dynamic'

export async function GET() {
  const client = new TappdClient()
  const testDeriveKey = await client.deriveKey("ethereum");
  const account = toViemAccountSecure(testDeriveKey);
  console.log(account);
  return Response.json({ address: account.address });
}
