import { TappdClient } from '@phala/dstack-sdk';
import { toViemAccountSecure } from '@phala/dstack-sdk/viem';

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const res = await request.json()
  const message = res.message;
  const client = new TappdClient()
  const testDeriveKey = await client.deriveKey("ethereum");
  const account = toViemAccountSecure(testDeriveKey);
  console.log(`Account [${account.address}] Signing Message [${message}]`);
  const signature = await account.signMessage({ message });
  console.log(`Message Signed [${signature}]`)
  return Response.json({ address: account.address, message: message, signature: signature });
}
